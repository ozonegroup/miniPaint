import config from './../../config.js';
import File_open_class from './open.js';
import Dialog_class from './../../libs/popup.js';
import alertify from './../../../../node_modules/alertifyjs/build/alertify.min.js';
import axios from './../../../../node_modules/axios/dist/axios.min.js';
import Helper_class from './../../libs/helpers.js';
/** 
 * manages image search on https://pixabay.com/en/service/about/api/
 */
class File_designs_media_class {

	constructor() {
		this.File_open = new File_open_class();
		this.POP = new Dialog_class();
		this.cache = [];
	}

	/**
	 * Image search api
	 * 
	 * @param {string} query
	 * @param {array} data
	 */
	my_designs(query = '', data = []) {
		var _this = this;
		var html = '';
		console.log("hola desde my_designs");
		
		var key = config.pixabay_key;
		key = key.split("").reverse().join("");

		if (data.length > 0) {
			for (var i in data) {
				html += '<div class="item pointer">';
				html += '<img class="displayBlock" alt="" src="' + data[i].previewURL + '" data-url="' + data[i].webformatURL + '" />';
				html += '</div>';
			}
			//fix for last line
			html += '<div class="item"></div>';
			html += '<div class="item"></div>';
			html += '<div class="item"></div>';
			html += '<div class="item"></div>';
		}

		var settings = {
			title: 'My Designs',
			comment: '',
			className: 'wide',
			params: [
				
			],
			on_load: function (params) {
				console.log("entro en primera");
				var node = document.createElement("div");
				node.classList.add('flex-container');
				node.innerHTML = html;
				document.querySelector('#popup #dialog_content').appendChild(node);
				//events
				var targets = document.querySelectorAll('#popup .item img');
				for (var i = 0; i < targets.length; i++) {
					targets[i].addEventListener('click', function (event) {
						//we have click
						window.State.save();
						this.dataset.url = this.dataset.url.replace('_640.', '_960.');
						var data = {
							url: this.dataset.url,
						};
						_this.File_open.file_open_url_handler(data);
					});
				}
				
				var url_params = {};
				location.search.substr(1).split("&").forEach(
					function (item) {
						url_params[item.split("=")[0]] = item.split("=")[1];
					}
				);
				
				console.log("testing variables");
				console.log(process.env.STORAGE_APP_URL);
				var base_url = process.env.STORAGE_APP_URL+'/storage/';
				
				$.ajax({
					url: process.env.STORAGE_APP_URL+'/my_designs',
					dataType: 'JSON',
					type: 'GET',
					data: {user_id: url_params.user_id},
					success : function(data) {
						
						var designs = data["designs"];
						var html ="";
						for (var item in designs) {
							//console.log(designs[item].thumbnail_file);
							html+='<div class="item pointer">';
							html+='<img class="template" width="200" class="displayBlock" alt="" src="'+base_url+url_params.user_id+'/'+designs[item].thumbnail_file+'" json-url="'+base_url+url_params.user_id+'/'+designs[item].json_file+'">';
							html+='</div>';
						}
						$(".flex-container").html(html);
						
						$(".template").click(function() {
						  //alert( "Handler for .click() called." );
						 // alert($(this).attr("json-url"));
						  var relocate_url = "?image="+$(this).attr("json-url")+"&user_id="+url_params.user_id;
						  window.location.href="/"+relocate_url;
						});
					}		
				});	
				
				/*
				axios.get('http://storageapp.test/my_designs', {
				    params: {
				      user_id: url_params.user_id
				    }
				  })
				  .then(function (response) {
				    console.log(response);
					data = response["data"];
					designs = data["designs"];
					for (var item in designs) {
						console.log(designs[item].thumbnail_file);
					}
				  })
				  .catch(function (error) {
				    console.log(error);
				  })
				  .then(function () {
				    // always executed
				  });  
				*/
				
			},
			on_finish: function (params) {
				if (params.query == '')
					return;

				if (_this.cache[params.query] != undefined) {
					//using cache

					setTimeout(function () {
						//only call same function after all handlers finishes
						var data = _this.cache[params.query];
						if (parseInt(data.totalHits) == 0) {
							alertify.error('Your search did not match any images.');
						}
						_this.search(params.query, data.hits);
					}, 100);
				}
				else {
					
					//query to service
					/*
					var URL = "https://pixabay.com/api/?key=" + key + "&per_page=50&q=" + encodeURIComponent(params.query);
					$.getJSON(URL, function (data) {
						_this.cache[params.query] = data;

						if (parseInt(data.totalHits) == 0) {
							alertify.error('Your search did not match any images.');
						}
						_this.search(params.query, data.hits);
					})
						.fail(function () {
							alertify.error('Error connecting to service.');
						});
					*/
				}
			},
		};
		this.POP.show(settings);
	}

}

export default File_designs_media_class;

