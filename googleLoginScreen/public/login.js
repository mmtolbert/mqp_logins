const performLogin = function( e ) {
    	e.preventDefault();
    	const text = document.querySelector("#inputField")

	const json = {
		    username: text.value
    	}

	// add to server
  	fetch("/submit${step}", {
    	 method: "POST",
    	 headers: { "Content-Type": "application/json" },
    	 body: json
  	})
    	.then(function(response) {
      		return response.json(); // wait on response
    	})
    	.then(json => {
    		// update screen to next page if username valid
	});

	step = step + 1
	return false; 
}

window.onload = function() {
	var step = 0
    	const button = document.querySelector( '#loginButton' )
    	button.onclick = performLogin
}
