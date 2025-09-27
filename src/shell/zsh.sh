__zi_init() {
  [[ -n "$ZI_INIT" ]] && return

  ZI_LOG_DIR="$HOME/.zi/logs"
  mkdir -p "$ZI_LOG_DIR"

  ZI_INIT=1
  ZI_ACTIVE=1

  export ZI_SESSION_ID="$(date +%s)-$$"
  ZI_SESSION_FILE="$ZI_LOG_DIR/history_$ZI_SESSION_ID"
  ZI_CURR_OUT="$ZI_LOG_DIR/current_$ZI_SESSION_ID"
  : > "$ZI_CURR_OUT"

  exec > >(tee -a "$ZI_CURR_OUT") 2>&1

}

__zi_strip_ansi() {
  perl -pe 's/\e(?:\[[0-9;]*[A-Za-z]|\][^\e]*\e\\|[PX^_].*?\e\\)//g'
}

preexec() {
  ZI_LAST_CMD="$1"
  : > "$ZI_CURR_OUT"
}

precmd() {
  local exit_code=$?
  local timestamp=$(date +'%Y-%m-%dT%H:%M:%S%z')

  if [[ -z "$ZI_LAST_CMD" || "$ZI_LAST_CMD" == "clear" || "$ZI_ACTIVE" -eq 0 || "$ZI_LAST_CMD" == zi* ]]; then
    return
  fi

  local output=$(__zi_strip_ansi < "$ZI_CURR_OUT" | jq -Rs .)

  if [[ "$exit_code" -eq 0 ]]; then
    output=""
  fi

  jq -n \
    --arg time "$timestamp" \
    --arg cmd "$ZI_LAST_CMD" \
    --argjson code "$exit_code" \
    --arg out "$output" \
    '{timestamp: $time, command: $cmd, exit_code: $code, output: $out}' \
    >> "$ZI_SESSION_FILE"

  echo "--END--" >> "$ZI_SESSION_FILE"
}

export ZI_SETUP=1

zi() {
  newsession() { 
    export ZI_SESSION_ID="$(date +%s)-$$"
    ZI_SESSION_FILE="$ZI_LOG_DIR/history_$ZI_SESSION_ID" 
    ZI_CURR_OUT="$ZI_LOG_DIR/current_$ZI_SESSION_ID" 
    : > "$ZI_CURR_OUT" 

    exec > >(tee -a "$ZI_CURR_OUT") 2>&1
  }

  stop() {
    if [[ "$ZI_ACTIVE" -eq 1 ]]; then
        exec > /dev/tty 2>&1
        echo "zi logging stopped."
        ZI_ACTIVE=0
    fi
  }

  start() {
    if [[ "$ZI_ACTIVE" -eq 0 ]]; then
        exec > >(tee -a "$ZI_CURR_OUT") 2>&1
        echo "zi logging started."
        ZI_ACTIVE=1
    fi
  }

  if [[ "$1" == "checkpoint" || "$1" == "cp" ]]; then
    newsession
  elif [[ "$1" == "clear" || "$1" == "clr" ]]; then
    newsession
    clear
  elif [[ "$1" == "stop" ]]; then
    stop
  elif [[ "$1" == "start" ]]; then
    start
  else
    command zi "$@"
  fi
}

autoload -Uz add-zsh-hook 
add-zsh-hook precmd __zi_init