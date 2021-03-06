
function database_initialize()
{
	try 
	{
		if (!window.openDatabase) 
		{
			alert('Sorry, you need to use a more modern browser to allow saving');
		}
		else
		{
			var name        = 'witchdoctor';
			var version     = '1.0';
			var displayName = 'WitchDoctor Saved Requests'
			var maxSize     = 512000;
			
			return openDatabase(name, version, displayName, maxSize);
		}
	}
	catch(e)
	{
		if(e == 2)
		{
			alert("Invalid database version.");
		}
		else
		{
			alert("Unknown error "+e+".");
		}
		return;
	}
}


function database_setup()
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;", [], function(transaction, results)
		{
			if(results.rows.length <= 2)
			{
				database_create();
			}
		});
	})	
}

function database_create()
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('CREATE TABLE category(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT "New Category");', []);
		transaction.executeSql('CREATE TABLE request(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL DEFAULT "New Request", data TEXT NULL, category INTEGER NOT NULL DEFAULT 1);', []);
		transaction.executeSql('INSERT INTO CATEGORY (name) VALUES ("Default");', []);
	});
}

function database_reset()
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('DROP TABLE category;', []);
		transaction.executeSql('DROP TABLE request;', []);
		
	});
}

function database_category_new(category, callback)
{
	var category     = category;
	var category_id  = 0;
	
	database.transaction(function (transaction) 
	{
		transaction.executeSql('INSERT INTO CATEGORY (name) VALUES (?);', [category]);
		transaction.executeSql('SELECT last_insert_rowid() id;', [], function(transaction, results){
			var row = results.rows.item(0);
			callback(row['id']);
		});
	});
}

function database_categories_refresh()
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('SELECT id, name FROM category WHERE name != "Default" ORDER BY name ASC;', [], function(transaction, results){
			var options = '';
			
			options += Mustache.to_html(WDTemplates.option, {label:"Default", value:1});
			for(var i = 0; i < results.rows.length; i++)
			{
				var row = results.rows.item(i);
				options += Mustache.to_html(WDTemplates.option, {label:row['name'], value:row['id']});
			}
			
			$('#inputCategorySave').html(options);
			$('#inputCategoryLoad').html(options);
		});
	});
}



function database_requests_for_category(category)
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('SELECT id, name FROM REQUEST WHERE category = ? ORDER BY name ASC;', [category], function(transaction, results)
		{
			$('.storage-load .context').html('');
			for(var i = 0; i < results.rows.length; i++)
			{
				var row  = results.rows.item(i);
				var html =  Mustache.to_html(WDTemplates.request_saved, {name:row['name'], id:row['id']});
				$('.storage-load .context').append(html);
				
				$('#btn_load_request_'+row['id']).bind('click', function(){
					var id = $(this).attr('id').split('_').pop();
					local_hide_load();
					local_request_load(id);

					return false;
				})
				
				$('#btn_delete_request_'+row['id']).bind('click', function(){
					var id = $(this).attr('id').split('_').pop();
					database_delete_request(id);
					return false;
				})
			}
		});
	});
}

function database_save_request(label, category_id, data)
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('INSERT INTO REQUEST (name, category, data) VALUES (?,?,?);', [label, category_id, data]);
	});
}

function database_delete_request(id)
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('DELETE FROM request WHERE id= ?;', [id], function(transaction, result){
			database_requests_for_category($('#inputCategoryLoad').val());
		});
	});
}

function database_load_request(id, callback)
{
	database.transaction(function (transaction) 
	{
		transaction.executeSql('SELECT name, data FROM REQUEST WHERE id = ? LIMIT 1;', [id], function(transaction, results){
			var row = results.rows.item(0);
			callback(row);
		});
	});
}
