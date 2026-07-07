# Deploy Find TA on a VPS

Target domain:

- `https://find-ta.hofeu.org`

Runtime:

- Node.js 20 LTS or newer
- PM2
- Nginx
- Certbot

The app defaults to `.local-data/find-ta-rooms.json` locally. In production, PM2 sets:

```bash
FIND_TA_DATA_DIR=/var/lib/heartfire-find-ta/.local-data
```

That keeps room data outside the Git working tree.

## DNS

Create this DNS record:

```text
Type: A
Host: find-ta
Value: <VPS IPv4 address>
TTL: 300 or automatic
```

If the VPS has IPv6, also create:

```text
Type: AAAA
Host: find-ta
Value: <VPS IPv6 address>
TTL: 300 or automatic
```

## First Deploy

```bash
sudo mkdir -p /var/www /var/lib/heartfire-find-ta/.local-data
sudo chown -R "$USER":"$USER" /var/lib/heartfire-find-ta

cd /var/www
git clone https://github.com/enciyang/heartfire_web_find_ta.git heartfire_web_find_ta
cd /var/www/heartfire_web_find_ta

npm install
npm run build

npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

## Nginx

```bash
sudo cp deploy/nginx-find-ta.hofeu.org.conf /etc/nginx/sites-available/find-ta.hofeu.org
sudo ln -s /etc/nginx/sites-available/find-ta.hofeu.org /etc/nginx/sites-enabled/find-ta.hofeu.org
sudo nginx -t
sudo systemctl reload nginx
```

After DNS points to the VPS:

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d find-ta.hofeu.org
```

## Update Deploy

```bash
cd /var/www/heartfire_web_find_ta
git pull
npm install
npm run build
pm2 restart heartfire-find-ta
```

Do not delete `/var/lib/heartfire-find-ta/.local-data`.
