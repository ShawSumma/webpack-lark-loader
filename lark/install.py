import subprocess
import sys

def install():
    try:
        from lark import Lark
    except ImportError as ie:
        subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'lark-parser'])

def main():
    install()

if __name__ == '__main__':
    main()