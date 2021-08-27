import subprocess
import sys

def install():
    try:
        import larkjs
    except ImportError as ie:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', '--user', 'larkjs'])

def main():
    install()
    subprocess.check_call([sys.executable, '-m', 'larkjs', sys.argv[1], '--out', sys.argv[2]])

if __name__ == '__main__':
    main()