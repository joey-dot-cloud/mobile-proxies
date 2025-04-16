#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
bash "$SCRIPT_DIR/stop.sh"
bash "$SCRIPT_DIR/start.sh"
bash "$SCRIPT_DIR/routing.sh"