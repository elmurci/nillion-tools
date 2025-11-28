from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            from blindfold import ClusterKey, decrypt
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            shares = data.get('shares', [])
            threshold = data.get('threshold')
            cluster_size = data.get('cluster_size')
            
            if not shares or threshold is None or cluster_size is None:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "error": "Missing required parameters: shares, threshold, cluster_size"
                }).encode())
                return
            
            # Create cluster
            cluster_obj = {'nodes': [{} for _ in range(cluster_size)]}
            
            # Generate key and decrypt
            key = ClusterKey.generate(cluster_obj, {"store": True}, threshold)
            decrypted = decrypt(key, shares)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "decrypted": decrypted,
                "runtime": "python"
            }).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": str(e),
                "type": type(e).__name__
            }).encode())