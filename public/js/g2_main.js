let player_id=[0,1,2,3]
let list = [1,2,3,4]
let myind=0

document.getElementById("response").style.display = "none"

list = list.sort(() => Math.random() - 0.5)

var result=''

ans=list.indexOf(1);
result+="Player "+ans+" will give answers<br>"
que=list.indexOf(2);
result+="Player "+que+" will ask question"
document.getElementById("role").innerHTML=result;

result="Waiting for the response, Player "+ans+" has to choose truth or dare"
document.getElementById("demo").innerHTML=result;

if(myind==ans){
    document.getElementById("response").style.display = "block"
}
function show_result(xx) {
    if(xx=='truth'){
        result="Player "+ans+" has choosen truth";
        document.getElementById("demo").innerHTML=result;
        alert(result);
    }
    else {
        result="Player "+ans+" has choosen dare";
        document.getElementById("demo").innerHTML=result;
        alert(result);
    }
    document.getElementById("tnd").style.display = "none"
}