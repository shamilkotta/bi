__bi_init() {
  [[ -n "$BI_INIT" ]] && return

  BI_LOG_DIR="$HOME/.bi/logs"
  mkdir -p "$BI_LOG_DIR"

  BI_INIT=1
  BI_ACTIVE=1

  export BI_SESSION_ID="$(date +%s)-$$"
  BI_SESSION_FILE="$BI_LOG_DIR/history_$BI_SESSION_ID"
  BI_CURR_OUT="$BI_LOG_DIR/current_$BI_SESSION_ID"
  : > "$BI_CURR_OUT"

  exec > >(tee -a "$BI_CURR_OUT") 2>&1

}

preexec() {
  BI_LAST_CMD="$1"
  : > "$BI_CURR_OUT"
}

precmd() {
  local exit_code=$?
  local timestamp=$(date +'%Y-%m-%dT%H:%M:%S%z')

  if [[ -z "$BI_LAST_CMD" || "$BI_LAST_CMD" == "clear" || "$BI_ACTIVE" -eq 0 ]]; then
    return
  fi

  local output=$(jq -Rs . < "$BI_CURR_OUT")

  if [[ "$exit_code" -eq 0 ]]; then
    output=""
  fi

  jq -n \
    --arg time "$timestamp" \
    --arg cmd "$BI_LAST_CMD" \
    --argjson code "$exit_code" \
    --arg out "$output" \
    '{timestamp: $time, command: $cmd, exit_code: $code, output: $out}' \
    >> "$BI_SESSION_FILE"

  echo "--END--" >> "$BI_SESSION_FILE"
}

export BI_SETUP=1

bi() {
  newsession() { 
    export BI_SESSION_ID="$(date +%s)-$$"
    BI_SESSION_FILE="$BI_LOG_DIR/history_$BI_SESSION_ID" 
    BI_CURR_OUT="$BI_LOG_DIR/current_$BI_SESSION_ID" 
    : > "$BI_CURR_OUT" 

    exec > >(tee -a "$BI_CURR_OUT") 2>&1
  }

  stop() {
    if [[ "$BI_ACTIVE" -eq 1 ]]; then
        exec > /dev/tty 2>&1
        echo "Bi logging stopped."
        BI_ACTIVE=0
    fi
  }

  start() {
    if [[ "$BI_ACTIVE" -eq 0 ]]; then
        exec > >(tee -a "$BI_CURR_OUT") 2>&1
        echo "Bi logging started."
        BI_ACTIVE=1
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
    command bi "$@"
  fi
}

autoload -Uz add-zsh-hook 
add-zsh-hook precmd __bi_init