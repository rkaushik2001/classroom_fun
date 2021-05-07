let player_id=[0,1,2,3]
let list = [1,2,3,4]
let myind=0

document.getElementById("for_police").style.display = "none"

list = list.sort(() => Math.random() - 0.5)
var display="Player id "+player_id+'<br>player role '+list;
document.getElementById("demo").innerHTML =display;
if(list[myind]==1){
    var result="You are King. Got 1000 points!<br>"
    police=list.indexOf(3);
    result+="Player "+police+" is police"
    document.getElementById("role").innerHTML=result;
}
else if(list[myind]==2){
    var result="You are a Minister. Wait till police take decision!<br>"
    police=list.indexOf(3);
    result+="Player "+police+" is police<br>"
    king=list.indexOf(1);
    result+="Player "+king+" is king"
    document.getElementById("role").innerHTML=result;

}
else if(list[myind]==3){
    document.getElementById("for_police").style.display = "block"

    cul_arr=[list.indexOf(2),list.indexOf(4)];
    cul_arr = cul_arr.sort(() => Math.random() - 0.5)
    
    king=list.indexOf(1);
    result="Player "+king+" is king<br>"
    result+="You are police. Let's find the theif among Player"+cul_arr[0]+' '+'Player '+cul_arr[1]+'<br>';
    document.getElementById("role").innerHTML=result;
    document.getElementById("cul1").innerHTML=cul_arr[0];
    document.getElementById("cul2").innerHTML=cul_arr[1];
}
else if(list[myind]==4){
    var result="You are a theif. keep silent and wait till police take decision!<br>"
    police=list.indexOf(3);
    result+="Player "+police+" is police<br>"
    king=list.indexOf(1);
    result+="Player "+king+" is king"
    document.getElementById("role").innerHTML=result;
}

function show_result(xx) {
    if(list[cul_arr[xx]]==4){
        alert("Correct Guess!");
    }
    else {
        alert("Your guess is wrong!")
    }

}