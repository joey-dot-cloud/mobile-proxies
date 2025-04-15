from flask import Flask, Response
import subprocess
import os

app = Flask(__name__)

SCRIPT_DIR = "scripts"

def run_script(script_name):
    script_path = os.path.join(SCRIPT_DIR, script_name)
    print(script_path)
    try:
        # Check if script exists
        if not os.path.exists(script_path):
            return Response(f"Script {script_name} not found", status=404)
        
        # Make sure script is executable
        os.chmod(script_path, 0o755)
        
        # Run the script and capture output
        result = subprocess.run([script_path], 
                              capture_output=True, 
                              text=True)
        
        # Return both stdout and stderr
        output = f"STDOUT:\n{result.stdout}\nSTDERR:\n{result.stderr}"
        return Response(output, mimetype='text/plain')
    
    except Exception as e:
        return Response(f"Error executing script: {str(e)}", status=500)

@app.route('/')
def home():
    return "OK"

@app.route('/start')
def start():
    return run_script("start.sh")

@app.route('/stop')
def stop():
    return run_script("stop.sh")

@app.route('/info')
def info():
    return run_script("info.sh")

@app.route('/refresh')
def refresh():
    return run_script("refresh.sh")

@app.route('/routing')
def routing():
    return run_script("routing.sh")

if __name__ == '__main__':
    # Create scripts directory if it doesn't exist
    os.makedirs(SCRIPT_DIR, exist_ok=True)
    app.run(host='0.0.0.0', port=80)
