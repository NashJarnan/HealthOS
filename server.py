# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, redirect, url_for, render_template, request, flash

# Flask constructor takes the name of 
# current module (__name__) as argument.
app = Flask(__name__)

# The route() function of the Flask class is a decorator, 
# which tells the application which URL should call 
# the associated function.
@app.route('/home')
# ‘/’ URL is bound with hello_world() function.
def render_home():
	return render_template('index.html')

@app.route('/overlay')

def render_overlay():
	return render_template('overlay.html')

@app.route('/charts')

def render_chartsgraphs():
	return render_template('charts.html')

# main driver function
if __name__ == '__main__':

	# run() method of Flask class runs the application 
	# on the local development server.
	app.run()
