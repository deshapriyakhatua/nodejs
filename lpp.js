var arr=[ [ 2,7,1,0 ],
          [ 7,2,0,1 ]]; //LHS
var b=[ 21,21 ];     //RHS
var cB=[0,0];
var cJ=[4,14,0,0]; //z value

var xB=['x3','x4'];  //extra elem


let count=0;
while(count<5){count++;
  var zJ_cJ=find_zJ_cJ(arr);    
  console.log('zj-cj: ',zJ_cJ);    
  console.log('ans: ',matchMax(zJ_cJ));    
  if(matchMax(zJ_cJ)){
      if(noFSolutn(cB)){console.log('no feasible solution'); break; }
      let hasAltSolution=altSolutn(zJ_cJ,xB);
      if(hasAltSolution!=undefined){
          keyColumn=hasAltSolution;
          keyRow=findKeyRow(arr,b,keyColumn);
           if(keyRow!==undefined){
               [xB,cB]=updateXBCB(xB,cB,cJ,keyColumn,keyRow);           
               [arr,b]=updateArrB(arr,b,keyRow,keyColumn);       
               console.log('xB: ',xB,'cB: ',cB);           
               console.log('arr: ',arr);           
               console.log('b: ',b);    
               var zJ_cJ=find_zJ_cJ(arr);    
               console.log('zj-cj: ',zJ_cJ);    
               if(matchMax(zJ_cJ)){
                   console.log('has alt solution'); break;
               }
               
           }
          
      }
      console.log(xB);console.log(b); break;
  }    
  else{           
    var keyColumn=findMinIndex(zJ_cJ);           
    var keyRow=findKeyRow(arr,b,keyColumn);  
    if(keyRow==undefined){console.log("unbounded solutions"); break;}
    console.log('key: ',arr[keyRow][keyColumn]);           
    [xB,cB]=updateXBCB(xB,cB,cJ,keyColumn,keyRow);           
    [arr,b]=updateArrB(arr,b,keyRow,keyColumn);           
    console.log('xB: ',xB,'cB: ',cB);           
    console.log('arr: ',arr);           
    console.log('b: ',b);    
  }
}  

function noFSolutn(cB){
    for(let i of cB){if(typeof(i)==='string'){return true;}}
    return false;
}

function altSolutn(zj_cj,xb){
    for(let i of xb){zj_cj[i.slice(1)*1-1]=false;}
    for(let j=0; j<zj_cj.length; j++){if(zj_cj[j]===0){return j;}}
}

function find_zJ_cJ(arr){
    let zJ_cJ=[];
    for(let i=0; i<arr[0].length; i++){
        let indxN=0; let bigM=0;
        for(let j=0; j<arr.length; j++){
            if(typeof(cB[j])==='string'){
                if(cB[j]=='-M'){bigM-=arr[j][i];}
                else{bigM+=arr[j][i];}
            }
            else{ indxN+=arr[j][i]*cB[j];}
        }
        if(typeof(cJ[i])==='string'){
            if(cJ[i]=='-M'){bigM+=1;}
            else{bigM-=1;}
        }
        else{indxN-=cJ[i];}
        if(bigM){
            if(indxN<0){zJ_cJ.push(bigM+'M'+indxN);}
            else{zJ_cJ.push(bigM+'M+'+indxN);}
        }
        else{zJ_cJ.push(indxN);}
    }
    return zJ_cJ;
}

function matchMax(zJ_cJ){
    for(let i of zJ_cJ){
        if(typeof(i)==='string'){
            if(i[0]==='-'){return false;}
        }
        else if(i<0){return false;}
    }
    return true;
}

function findMinIndex(arr){
    let min=+Infinity; let indx;
    let preArr=[]; let postArr=[]; let indxArr=[];
    arr.forEach((e,i)=>{
        if(typeof(e)==='string' && e[0]==='-'){
            indxArr.push(i);
            let prePost=e.split('M').map(Number);
            preArr.push(prePost[0]);
            postArr.push(prePost[1]);
        }
        else{ if(e<min){min=e; indx=i;} }
     });
     let min2=Infinity; let postMin; let indx2;
     preArr.forEach((e,i)=>{
         if(e<min2){min2=e; indx2=indxArr[i]; postMin=postArr[i];}
         else if(e==min2){
             if(postArr[i]<postMin){postMin=postArr[i]; indx2=indxArr[i];}
         }
     });
    // console.log(indx,indx2);
     if(indx2!=undefined){return indx2;}
    return indx;
}

function findKeyRow(arr,b,k){    
  let min=+Infinity; let indx;    
  b.forEach((e,i)=>{if(arr[i][k]>0){ let div=e/arr[i][k]; if(div<min){min=div; indx=i;} }});      
  return indx;
}

function updateXBCB(xB,cB,cJ,kC,kR){ xB[kR]=`x${kC+1}`; cB[kR]=cJ[kC]; return [xB,cB];}

function updateArrB(arr,b,kR,kC){    
  b[kR]=b[kR]/arr[kR][kC];    
  arr[kR]=arr[kR].map((e)=>e/arr[kR][kC]);    
  for(let i=0; i<arr.length; i++){        
    if(i!=kR){            
      let elem=arr[i][kC];            
      for(let j=0; j<arr[0].length; j++){                
        arr[i][j]=arr[i][j]-(arr[kR][j]*elem);            
      }            
      b[i]=b[i]-(b[kR]*elem);        
    }    
  }    
  return [arr,b];
}

           
