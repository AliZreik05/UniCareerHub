function $(id){
    return document.getElementById(id);
}

function class_elem(class_name){
    return document.getElementsByClassName(class_name)[0];
}

window.onload = function (){
  $("addReview").onclick = addComment;
};

function removeElement(element){
    element.parentNode.removeChild(element);
}

function addComment(){
   var parent_div = class_elem("reviews"); 

   var link = document.createElement("a");

   var child_div = document.createElement("div");
   child_div.className = "inner-child-div";

   var child_child_div_1 = document.createElement("div");
   child_child_div_1.className = "inner-inner-child-div-1";

   var img1 = document.createElement("img");
   img1.src = "images/blank-profile-picture.png";
   

   child_child_div_1.appendChild(img1);

   child_child_div_1.appendChild(document.createTextNode("User: "));
   var text_box_1 = document.createElement("input");
   child_child_div_1.appendChild(text_box_1); 

   child_div.appendChild(child_child_div_1);
  
   var child_child_div_2 = document.createElement("div"); // Fixed

   var text_box_2 = document.createElement("textArea"); // Fixed
  
   child_child_div_2.appendChild(text_box_2);

   
  
   var child_child_div_1_1 =
   document.createElement("div");
    
   child_child_div_1_1.className = "inner-inner-child-div-2";

   var text_box_1_1 = document.createElement("input");

   child_child_div_1_1.appendChild(document.createTextNode("Company Name: "));

   child_child_div_1_1.appendChild(text_box_1_1);



   child_div.appendChild(child_child_div_1_1);

   child_div.appendChild(child_child_div_2);
    
   
   


   var child_child_div_3 = document.createElement("div");

   child_child_div_3.className = "inner-inner-child-div-2";
  
   var submitBtn = 
   document.createElement("button");

   submitBtn.innerText = "Submit";
   submitBtn.className = "buttons-design";

   submitBtn.onclick = function(){Submit(child_div);};
   
   child_child_div_3.appendChild(submitBtn);

   child_div.append(child_child_div_3);

   link.appendChild(child_div);
   
   
   
   parent_div.appendChild(link);

   

}

function Submit(c){
    var parent_div = class_elem("reviews");
    
    

    var child_divs = c.children;

    for(var i = 0; i < child_divs.length; i++){
        var currentDiv = child_divs[i];
        
        var currentInput = currentDiv.getElementsByTagName("input")[0];
        var btn = currentDiv.getElementsByTagName("button")[0];
        var currentTextBox = currentDiv.getElementsByTagName("textArea")[0];
          
        if(currentInput)
        currentInput.readOnly = true;
          
        if(currentTextBox)
        currentTextBox.readOnly = true;
         
        if(btn){
        current_div = btn.parentNode;
        current_div.className = "div_current";
        removeElement(btn);
        var comment_btn = document.createElement("button");
        comment_btn.innerText = "Comments";
        comment_btn.className = "buttons-design";
        comment_btn.onclick = function(){
            Comment_current;
        }
        
        current_div.appendChild(comment_btn);

        var delete_btn = document.createElement("button");
        delete_btn.innerText = "Delete";
        delete_btn.className = "buttons-design";
        delete_btn.onclick = function(){
            removeElement(current_div.parentNode.parentNode);
        }

        current_div.appendChild(delete_btn);
        }
    }


    
}


function Comment_current(){

}