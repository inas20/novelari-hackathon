//var http = require('http');
var fs = require('fs');
import {parse} from 'himalaya'

const html = fs.readFileSync('./samples/demo.html', {encoding: 'utf8'})
const root = parse(html);
let jsonOp = {}
jsonOp.sections= []
var arrayNodes = []

if(root.length >0){
    root.forEach(element => {
            if(element.children.length > 0){
              extractTags(element.children)
            }
    });
}


function saveNode(node, key, array){
  if(key != null){
    let index =arrayNodes.findIndex(arr => arr.key == key)
    if(index != -1){
      console.log('arrayNodes--index-before-', arrayNodes[index])
        let x = {subsections:[]}
        x.subsections.push({subsection: array[0].content.trim()})
        arrayNodes[index] = Object.assign({},arrayNodes[index], x)
        console.log('arrayNodes--index-after-',arrayNodes[index])
    }
    console.log('array--nodes---', arrayNodes)
  }else{
    arrayNodes.push(node)
  }
}

function createNode(arr){
  console.log('arr--', arr)
  var textNode = arr.filter(t=> t.type == 'text' && t.content.trim().length != 0)
  let keyElement = Math.round(Math.random() * 1000000);
  let elementNode = {section: textNode[0].content.trim(), key :keyElement}
  saveNode(elementNode)
  console.log('textNode---', keyElement, elementNode);
  return keyElement;
}

function extractTags (array, key){
  console.log('key---', key)
  let subArray = array.filter(arr => arr.type ='element' && (arr.children))
  console.log('subArray--', subArray)
  if(subArray.length > 0){
    subArray.forEach(arr =>{
          if(arr.tagName == 'li'){
            if(key != null){
              console.log('arr--key--', arr.children)
              saveNode(null, key, arr.children)
            }
            if(arr.children && key == null){
              let keyNode= createNode(arr.children)
              console.log('arr.children---li--', arr.children)
              extractTags(arr.children, keyNode)
            }
          }else if(arr.children && arr.children.length>0){
                //console.log('arr.children---', arr.children)
                  extractTags(arr.children, key)
        }
    })
  }
}
