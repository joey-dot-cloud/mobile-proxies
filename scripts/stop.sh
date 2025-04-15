#!/bin/bash

# Disconnect the device from the network
mbimcli -d /dev/cdc-wdm0 --disconnect --device-open-proxy