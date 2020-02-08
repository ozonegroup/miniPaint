# miniPaint
777
Online image editor lets you create, edit images using HTML5 technologies.
No need to buy, download, install or have obsolete flash. No ads.
Key features: layers, filters, HTML5, open source, Photoshop alternative.

miniPaint operates directly in the browser. You can create images, paste from clipboard (ctrl+v) 
or upload from computer (using menu or drag & drop). Nothing will be sent to any server. Everything stays in your browser. 

## URL:
**https://viliusle.github.io/miniPaint/**

## Preview:
![miniPaint](https://raw.githubusercontent.com/viliusle/miniPaint/master/images/preview.gif)
(generated using miniPaint)

**Change log:** [/miniPaint/releases](https://github.com/viliusle/miniPaint/releases)

## Browser Support
- Chrome
- Firefox
- Opera
- Safari
- Edge (missing few features)
- IE 11 (only basic support)

## Features

- **Files**: open images, directories, URL, drag and drop, save (PNG, JPG, BMP, WEBP, animated GIF, JSON (layers data), print.
- **Edit**: Undo, cut, copy, paste, selection, paste from clipboard.
- **Image**: information, EXIF, trim, zoom, resize (Hermite resample, default resize), rotate, flip, color corrections (brightness, contrast, hue, saturation, luminance), auto adjust colors, grid, histogram, negative.
- **Layers**: multiple layers system, differences, merge, flatten, Transparency support.
- **Effects**: Black and White, Blur (box, Gaussian, stack, zoom), Bulge/Pinch, Denoise, Desaturate, Dither, Dot Screen, Edge, Emboss, Enrich, Gamma, Grains, GrayScale, Heatmap, JPG Compression, Mosaic, Oil, Sepia, Sharpen, Solarize, Tilt Shift, Vignette, Vibrance, Vintage, Blueprint, Night Vision, Pencil.
- **Tools**: pencil, brush, magic wand, erase, fill, color picker, letters, crop, blur, sharpen, desaturate, clone, borders, sprites, key-points, color to alpha, color zoom, replace color, restore alpha, content fill.
- **Help**: keyboard shortcuts, translations.

## Embed
To embed this app in other page, use this HTML code:

    <iframe style="width:100%; height:1000px;" id="miniPaint" src="https://viliusle.github.io/miniPaint/"></iframe>

## Build instructions
See [Wiki > Build instructions](https://github.com/viliusle/miniPaint/wiki/Build-instructions)

## Wiki
See [Wiki](https://github.com/viliusle/miniPaint/wiki)

## License
MIT License

## Support
Please use the GitHub issues for support, features, issues or use mail www.viliusl@gmail.com for contacts.

#Entendiendo My Designs
Logica para mostrar My Designs
La manera como carga los modulos en el menu es compleja y expresa la siguiente simetria que ha sido descifrada.

1. DECLARACION DEL HTML SEGUN SIMETRIA IDENTIFICADA
config.menu.js Donde esta el HTML del menu. La clave es el atributo data-target.
file/designs.my_designs 
Donde: 
file-> hacer referencia al folder: src/js/file 
designs-> al archivo clase dentro del folder
my_designs -> al metodo que debe cargar cuando se haga click. Este se encuentra dentro la clase de arriba

2. CARGA LAS CLASES DE LOS MODULOS DE MANERA DINAMICA
Los modulos o clases se cargan desde load_modules() de la clase src/js/core/base-gui.js
var modules_context = require.context("./../modules/", true, /\.js$/);
modules_context.keys().forEach(function (key) {
....
}
Esto es una especie de loop entre los archivos que estan dentro del folder: src/modules

3. CARGAR LOS LISTENERS Y EL METODO DE INICIALIZACION DE MANERA DINAMICA 
Para esto se utiliza le metodo set_events() en el archivo src/js/core/base-gui.js
El metodo de inicializacion es el ultimo /file/{archivo_de_clase}/{metodo_de_inicio}
{metodo_de_inicio} se necuentra dentro de la clase.

#Entendiendo Save as Studio
Estamos usando la siguiente logica de Laravel 
https://laravel.com/docs/5.8/filesystem

php artisan storage:link


#VAriables de Sistema
Archivo: /.env
DB_HOST=127.0.0.1
DB_PASS=foobar
S3_API=mysecretkey
STORAGE_APP_URL=http://storageapp.test


#Deploy
Para hacer depploy utlizamos este script /hardening/studio.sh
git clone https://github.com/viliusle/miniPaint.git

cd miniPaint
npm install - it will install all dependencies from package.json file into node_module folder
There are 2 ways to edit files:
Run npm run server - it will create simple local server (webpack-dev-server) with live reload. Run command, edit files and debug using http://localhost:8080/ URL. Recommended way.
Edit files and run npm run dev command to generate/update dist/bundle.js
To generate minified code for production, run npm run build. Code is build using webpack.

#Storage APP Integration
En el servidor VPS donde este instalada la App de storage se debe activar el modulo de apache mod_headers.c de la siguiente manera para Ubuntu:

a2enmod headers
systemctl restart apache2

Agregar esto al archivo .conf

<IfModule mod_headers.c>
        Header Set Access-Control-Allow-Origin "*"
        Header add Access-Control-Allow-Headers "origin, x-requested-with, content-type"
        Header add Access-Control-Allow-Methods "PUT, GET, POST, DELETE, OPTIONS"
</IfModule>

#Agregando propiedad a Text

1. Se agrega la propiedad a settings en: /src/js/tools/text.js
		//ask for text
		var settings = {
			{name: "letter_spacing", title: "Letter spacing:", value: '1px', values: ["1px", "2px", "3px","4px","5px"], type: 'select' },
			
2. Editar el atributo var template en: /src/js/core/gui/gui-details.js
Ejemplo:
		<div class="row">
			<span class="trn label">Letter spacing:</span>
			<select id="detail_param_letter_spacing">
				<option value="-5px">-5px</option>
				<option value="-4px">-4px</option>
				<option value="-3px">-3px</option>
				<option value="-2px">-2px</option>
				<option value="-1px">-1px</option>
				<option value="0px">0px</option>
				<option value="1px">1px</option>
				<option value="2px">2px</option>
				<option value="3px">3px</option>
				<option value="4px">4px</option>
				<option value="5px">5px</option>
			</select>
		</div>

3. Despues cargamos el evento en render_details en : src/js/core/gui/gui-details
this.render_general_select_param('letter_spacing', events);
Esto activa la funcion render_general_select_param es responsable de cargar y editar el json

4. Despues se activa need_render y este activa la clase render_object en render_object en /src/js/core/base-layers.js
Esta clase es la reponsable de dibujar en el canva object
 * Layers class - manages layers. Each layer is object with various types. Keys:
 
En el metodo render_object se hackea dependiendo del type ejemplo:

if(object.type =="text"){
	//ctx.letterSpacing = object.params["letter_spacing"];
	this.canvas.style.letterSpacing = object.params["letter_spacing"];
}







