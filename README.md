# mobile-proxies

## Python setup
apt install python3-full
apt install python3-flask

## IP forwarding setup
sysctl -w net.ipv4.ip_forward=1

## 3Proxy setup
wget https://github.com/3proxy/3proxy/releases/download/0.9.5/3proxy-0.9.5.arm.deb
apt install ./3proxy-0.9.5.arm.deb
systemctl start 3proxy

## SIM setup
apt install libmbim-utils