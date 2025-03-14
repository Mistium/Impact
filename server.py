#!/usr/bin/env python3
import http.server
import socketserver
import os
import sys
import socket
import subprocess
import platform

# Default port
PORT = 8000

# Allow custom port from command line argument
if len(sys.argv) > 1:
  try:
    PORT = int(sys.argv[1])
  except ValueError:
    print(f"Invalid port: {sys.argv[1]}")
    print(f"Using default port: {PORT}")

def kill_process_on_port(port):
  """Kill any process that is using the specified port."""
  system = platform.system()
  try:
    if system == "Windows":
      # Windows command to find and kill process on a port
      output = subprocess.check_output(f'netstat -ano | findstr :{port}', shell=True).decode()
      if output:
        # Extract PID from output
        for line in output.strip().split('\n'):
          if f":{port}" in line:
            pid = line.strip().split()[-1]
            subprocess.call(f'taskkill /PID {pid} /F', shell=True)
            print(f"Process with PID {pid} using port {port} has been terminated.")
            break
    else:
      # Unix/Linux/Mac command
      output = subprocess.check_output(f'lsof -i :{port} -t', shell=True).decode()
      if output:
        pid = output.strip()
        subprocess.call(f'kill -9 {pid}', shell=True)
        print(f"Process with PID {pid} using port {port} has been terminated.")
  except subprocess.CalledProcessError:
    # No process found on the port
    print(f"No process found using port {port}.")
  except Exception as e:
    print(f"Error attempting to kill process on port {port}: {e}")

# Kill any process using the port before starting the server
print(f"Checking if port {PORT} is in use...")
kill_process_on_port(PORT)

# Change directory to the script's location
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class MyHttpRequestHandler(http.server.SimpleHTTPRequestHandler):
  def do_GET(self):
    # Handle the case where the URL path is empty or '/'
    if self.path == '/' or not self.path:
      self.path = '/index.html'
    
    return http.server.SimpleHTTPRequestHandler.do_GET(self)

  def log_message(self, format, *args):
    # Customized log message format
    sys.stdout.write(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}\n")
    sys.stdout.flush()

handler = MyHttpRequestHandler

# Enable socket reuse to prevent "Address already in use" errors
socketserver.TCPServer.allow_reuse_address = True

try:
  with socketserver.TCPServer(("", PORT), handler) as httpd:
    host = "localhost" if "localhost" in httpd.server_address[0] else httpd.server_address[0]
    url = f"http://{host}:{PORT}"
    
    print(f"\n🚀 Impact Extensions server running at: {url}")
    print(f"💡 Press Ctrl+C to stop the server\n")
    
    try:
      httpd.serve_forever()
    except KeyboardInterrupt:
      print("\n🛑 Server stopped.")
except OSError as e:
  print(f"\n❌ Error: {e}")
  print("Try using a different port number.")
  sys.exit(1)
