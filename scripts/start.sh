#!/bin/bash

# Connect the device to the network
mbimcli -d /dev/cdc-wdm0 --query-registration-state --device-open-proxy
mbimcli -d /dev/cdc-wdm0 --attach-packet-service --device-open-proxy
mbimcli -d /dev/cdc-wdm0 --connect=apn='mworld.be' --device-open-proxy