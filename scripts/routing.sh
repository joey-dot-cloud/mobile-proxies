#!/bin/bash

# Bring down the interface and flush existing addresses
ip link set dev wwan0 down
ip addr flush dev wwan0
ip -6 addr flush dev wwan0

# Get IP configuration
echo "Getting connection information"
connection_info=$(mbimcli -d /dev/cdc-wdm0 --query-ip-configuration=0 --device-open-proxy)

# Extract IPv4 address and gateway
ipv4_address=$(echo "$connection_info" | grep "IP \[0\]" | awk -F"'" '{print $2}')
gateway=$(echo "$connection_info" | grep "Gateway" | awk -F"'" '{print $2}')
mtu=$(echo "$connection_info" | grep "MTU" | awk -F"'" '{print $2}')

# Extract DNS servers
#dns1=$(echo "$connection_info" | grep "DNS \[0\]" | awk -F"'" '{print $2}')
#dns2=$(echo "$connection_info" | grep "DNS \[1\]" | awk -F"'" '{print $2}')


ip link set dev wwan0 up

# Configure the interface
ip link set dev wwan0 mtu $mtu

echo "Adding address $ipv4_address to wwan0"
ip addr add $ipv4_address dev wwan0

echo "Adding default route via $gateway dev wwan0"
ip route add default via $gateway dev wwan0

# Check if 3proxy config directory exists and update configuration
if [ -f "/etc/3proxy/conf/3proxy.cfg" ]; then
    echo "Updating 3proxy config"
    # Extract just the IP address without the subnet mask
    clean_ip=$(echo $ipv4_address | cut -d'/' -f1)
    cat >/etc/3proxy/conf/3proxy.cfg <<EOF
nscache 65536
nserver 1.1.1.1
nserver 1.0.0.1

config /conf/3proxy.cfg
monitor /conf/3proxy.cfg

log /logs/3proxy-%y%m%d.log D
rotate 60
counter /count/3proxy.3cf

include /conf/counters
include /conf/bandlimiters

auth none

proxy -p3000 -i0.0.0.0 -e${clean_ip}
EOF
fi

# Update DNS configuration
#echo "nameserver $dns1" > /etc/resolv.conf
#echo "nameserver $dns2" >> /etc/resolv.conf
