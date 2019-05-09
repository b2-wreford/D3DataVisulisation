//2MJMN0CCZKLM3H4D
/*
var normalize = window.jsonApiNormalize;*/


//______________________________________________________________
// Declare varibles for collecting API data. Fetch API key from 
// text box on the HTML page.
//______________________________________________________________
	let apiKey;
	let symbol;
	init();
	function init() {
		apiKey = localStorage.getItem( 'apiKey' );
		inpApiKey.value = apiKey ? apiKey : '' ;
	}
//______________________________________________________________
// Test to see if DEMO symobols have been entered. If not use the 
// user inputted symbol and the pre loaded API key.
//______________________________________________________________

	function getAlphaVantagedata() {
		const func = selFunction.value; 
		const size = selSize.value;
		const type = selType.value;
		const interval = selInterval.value;
		symbol = inpSymbol.value;
		const demo = symbol === 'MSFT' && apiKey === 'demo' ? true : false;
		if ( demo === true ) {
			url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo';
		} else {
			url = 'https://www.alphavantage.co/query?function=' + func +
				'&symbol=' + symbol +
				'&interval=' + interval +
				'&outputsize=' + size +
				'&datatype=' + type +
				'&apikey=' + apiKey;
		}
		requestFile( url );
	}

//______________________________________________________________
// Request the HTML file from target URL and load the JSON data. 
// If not symbol, return error message.
//______________________________________________________________
	function requestFile( url ) {
		const xhr = new XMLHttpRequest();
		xhr.open( 'GET', url, true );
		xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
		xhr.onprogress = function( xhr ) { console.log( 'bytes loaded:', xhr.loaded  ); }; 
		xhr.onload = callback;
		xhr.send( null );
		function callback( xhr ) {
			const response = xhr.target.response;
			divContents.innerText = response;
			if (response.slice( 0, 1) !== '{' ) { return; } // not a json file
			const json = JSON.parse( response );
console.log( 'json', json );
		}
	}
	function setInterval() {
		spnInterval.style.display = selFunction.value !== 'TIME_SERIES_INTRADAY' ? 'none' : '';
	}

//______________________________________________________________
// If download button is clicked, save JSON file to users cpu. 
//______________________________________________________________
	function saveDataToFile() {
		const blob = new Blob( [ divContents.innerText ] );
		let a = document.body.appendChild( document.createElement( 'a' ) );
		a.href = window.URL.createObjectURL( blob );
		a.download = symbol + '.txt';
		a.click();
		a = null;
	}
	function setStorage() {
		apiKey = inpApiKey.value;
		localStorage.setItem('apiKey', apiKey );
	}
//______________________________________________________________
// Fetch the API key from storage button box. 
//______________________________________________________________
	function getStorage() {
		apiKey = localStorage.getItem( 'apiKey' );
	}


	/*normalize(getAlphaVantagedataJsonApiData).get('Symbol');
// will return 'JSON API paints my bikeshed!

normalize(getAlphaVantagedataJsonApiData).get('TimeSeries(1min).open');
// will output 'John'
/*
normalize(articleJsonApiData).get(['id', 'title', 'body']);*/
// will return
// {
//     id: '1',
//     title: 'JSON API paints my bikeshed!',
//     body: 'The shortest article. Ever.'
// }*/