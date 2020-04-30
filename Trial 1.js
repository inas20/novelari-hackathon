var fs = require('fs');
import {parse} from 'himalaya'

const path = './samples';

fs.readdir(path, function(err, items) {
    if (err){
        console.log('err---', err)
        throw err;
    } 
    else{
        // loop to read each input file 
        for (var i=0; i<items.length; i++) {
            var file = path + '/' + items[i];            
            const html = fs.readFileSync(file, {encoding: 'utf8'})
            const root = parse(html);
            let jsonObj= {}
            jsonObj.sections= []
            if(root.length >0){
                root.forEach(element => {
                        if(element.children && element.children.length > 0){
                            extractTags(element.children, file, jsonObj)
                        }
                });
            }
        }
    }
});


function extractTags (array, fileName, jsonObj){
    // filter the nodes from comments and unwanted text
    let subArray = array.filter(arr => arr.type ='element' && (arr.tagName == 'ul' || arr.children))
    if(subArray.length > 0){
       subArray.forEach(arr =>{
            if(arr.tagName =='li'){
                if(arr.children){
                    var first = {}
                    //loop on the children of the tag
                    arr.children.forEach(child =>{
                        //check if the node has text content
                        if(child.type == 'text'){
                            first['section']= child.content.trim()                            
                        }else if(child.children){
                            let arr1 = child.children.filter(ch => ch.type =='element')
                            if(arr1.length > 0 && arr1[0].children[0] && arr1[0].children[0].content){
                                first.paragraghs = arr1[0].children[0].content
                                jsonObj.sections.push(first)
                                // write the json object to output file
                                fs.writeFile(fileName + '.json', JSON.stringify(jsonObj), (err) => {
                                    if (err) throw err;
                                    console.log('Data written to file');
                                });
                            }
                        }
                    })
                }
            }else if(!!arr.children && arr.children.length>0){
                    extractTags(arr.children, fileName, jsonObj)
           }
       })
    }
  }