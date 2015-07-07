function run_depiction_engine(contentBlocks,xml) {
	document.title = $(xml).find("package>name").text();

	$.each(contentBlocks, function (key,contentInfo){
		
		/*
		if (key=='changesList') {
			contentInfo.source=contentInfo.source.replace(/{VERSION}/i,version);
		}
		*/
		console.log('Processing '+key);
		console.log('  type= '+contentInfo.type);
		switch(contentInfo.type) {
			case "list":
				var list = $(xml).find(contentInfo.source);
				if (list.size()==0) {
					$(contentInfo.panel).hide(); //hide panel if 
				} else {
					if (!!contentInfo.reverseRender) {
						list = $(list).get().reverse();
					}
					if (!key) {return}
					$.each(list, function(index,value){
						var item = $(value).text()
						if (contentInfo.render) {
							item = contentInfo.render(value);
						}
						if (!!contentInfo.reverseRender) {
							$("#"+key).prepend('<li><p>'+item+'</p></li>')
						} else {
							$("#"+key).append('<li><p>'+item+'</p></li>')
						}
					});
				}
				break;
			case "text":
				if (!key) {return}
				var content = $(xml).find(contentInfo.source).text();
				if (contentInfo.render) {
					content = contentInfo.render($(xml).find(contentInfo.source))
				}
				$("#"+key).html(content)
				break;
			case "link":
				if (!key) {return}
				console.log('  url= '+contentInfo.url);
				console.log('  text= '+contentInfo.text);

				var url = contentInfo.url;
				var params = [];
				if (contentInfo.params) {
					$.each(contentInfo.params, function(){
						console.log(this);
						params[params.length] = this.join('=');
					});
				}
				url = url+'?'+params.join('&');
				$("#"+key).append( $("<a></a>")
					.attr("href",url)
					.text(contentInfo.text)
				 );
				break;
			case "article":
				if (!key) {return}
				var articles = 	$(xml).find(contentInfo.source);
				$.each(articles.get().reverse(),function(index,article){
					console.log(article);
					var title = $(article).find(contentInfo.titleSource).text();
					console.log(title);
					$(key).append("<h2>"+title+"</h2>");
					var plist = $(key).append("<ul></ul>");
					$.each($(article).find(contentInfo.paragraphSource),function(index,paragraph){
						$(key+">ul").append( $("<li><p>"+$(paragraph).text()+"</p></li>") )
					})

				})

				break;
			case "custom":
				if (!key) {return}
					console.log($(xml).find(contentInfo.source));

				contentInfo.render( $('#'+key), $(xml).find(contentInfo.source) )

				break;
		}//switch
	}); //each
}