let Button =document.getElementById('button')
let listContainer=document.getElementById('listContainer')
//listContainer.addEventListener('submit',performAction)
let boardId='5dee2f12b46bca0182513498';
let Key='9ed5dfdc56ac4f121983d29ba7483ada';
let Token='185ea6e13891ef88d65ee14d96ef1560548f75840436c8c5e7f6951b2333437a'
getCurrentBoard='https://api.trello.com/1/boards/'+boardId+'?key='+Key+'&token='+Token;
refreshPage()
quickurl='https://api.trello.com/1/boards/'+boardId+'/lists?cards=all&key='+Key+'&token='+Token
//Button.addEventListener('submit',addList);
//url1='https://api.trello.com/1/members/me/boards?key=9ed5dfdc56ac4f121983d29ba7483ada&token=185ea6e13891ef88d65ee14d96ef1560548f75840436c8c5e7f6951b2333437a';
getDifferentList='https://api.trello.com/1/boards/5dee2f12b46bca0182513498/lists?cards=all&card_fields=all&filter=open&fields=all&key=9ed5dfdc56ac4f121983d29ba7483ada&token=185ea6e13891ef88d65ee14d96ef1560548f75840436c8c5e7f6951b2333437a'
// url4='https://api.trello.com/1/lists/5dee2f2e0a00ac6b1e671955?fields=name%2Cclosed%2CidBoard%2Cpos&key=9ed5dfdc56ac4f121983d29ba7483ada&token=185ea6e13891ef88d65ee14d96ef1560548f75840436c8c5e7f6951b2333437a'
// url5='https://api.trello.com/1/lists/5dee2f2e0a00ac6b1e671955/cards?fields=id,name,badges,labels&key=9ed5dfdc56ac4f121983d29ba7483ada&token=185ea6e13891ef88d65ee14d96ef1560548f75840436c8c5e7f6951b2333437a'
// url6='https://api.trello.com/1/cards/5dee2fda994edb6e06b24861/checklists?checkItems=all&checkItem_fields=name%2CnameData%2Cpos%2Cstate&filter=all&fields=all&key=9ed5dfdc56ac4f121983d29ba7483ada&token=185ea6e13891ef88d65ee14d96ef1560548f75840436c8c5e7f6951b2333437a'
// id='5dee2fda994edb6e06b24861'

    // let result=fetch(getDifferentList)
    // result.then(response => {
    //     if (response.ok) {
    //         console.log(response.json())
    //         //return response.json();
    //     }
    // }).catch(console.log('something wrong in api'))


 async function refreshPage(){
     while(listContainer.hasChildNodes()){
         listContainer.removeChild(listContainer.firstChild);
     }
    try{
    result=await fetch(getCurrentBoard)
    if(result.ok){
        result1= await result.json();
        listId=result1.id
        console.log("board retrieved")
        console.log(result1.name)
    }}catch (e) {console.log("problem in getting current board")}

    try{
    listNames=await fetch(quickurl)
     if(listNames.ok){
         result1= await listNames.json();
         console.log(result1)
     }}catch (e) {console.log('problem in getting all the listID')}
     refereshList(result1)
}

async function refereshList(result1){
    let listcontainer
    let eachlist
    let AddAnotheList
    try{
        for(let i=0;i<result1.length;i++){
            let itemno=i+1;
            listContent=result1[i];
            console.log(listContent.name+"list retrieved");
            listcontainer=document.createElement('div');
            listcontainer.className='list'+itemno+'container';
            listcontainer.className='ListContainer';
            eachlist=document.createElement('div');
            eachlist.className='list'+itemno;
            eachlist.className='smalllist';
            eachlist.setAttribute('listId',listContent.id)
            eachlist.listId=listContent.id
            eachlist.appendChild(document.createTextNode(listContent.name+''));

            try{

                numberOfCard=listContent.cards.length

                for(let j=0;j<numberOfCard;j++){
                     cards=document.createElement('div');
                     refreshCards(cards,listContent.cards[j]);
                     eachlist.appendChild(cards);
                }
                //let buttonDiv=document.createElement('div')
                let addCardButton=document.createElement('input')
                addCardButton.type='button'
                addCardButton.value='+ Add Another Card'
                addCardButton.className='addCard'
                addCardButton.addEventListener('click',function(e){
                    let listId=e.target.parentNode.listId;
                    console.log(listId);
                    addCard(e,listId);
                })
                eachlist.appendChild(addCardButton)



            }catch (e) {console.log('problem in getting cards')}
            listcontainer.appendChild(eachlist);

            listContainer.appendChild(listcontainer);
        }
        AddAnotherList = document.createElement('input');
        AddAnotherList.type='button'
        AddAnotherList.className = 'buttonelement';
        AddAnotherList.value='Add Another List'
        AddAnotherList.addEventListener('click',addList)
        listContainer.appendChild(AddAnotherList)

    }catch (e) {console.log('problem in creating list dynamically')}

}

function refreshCards(cards,result3){
    let textDiv=document.createElement('div')
    let textNode=document.createTextNode(result3.name+'')
    textDiv.appendChild(textNode)
    textDiv.contentEditable=true

    let editButton=document.createElement('input')
    let deleteButton=document.createElement('input')
    editButton.type='button'
    editButton.className='editDel'
    editButton.value="Edit"
    editButton.addEventListener('click',function(e){e.preventDefault();
    let name1=e.target.previousSibling.textContent;
    e.stopPropagation();
    console.log(name1);editCard(result3.id,name1)});
    deleteButton.type='button'
    deleteButton.className='editDel'
    deleteButton.value="Delete"
    deleteButton.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();
    deleteCard(result3.id)});
    cards.appendChild(textDiv)
    cards.appendChild(editButton)
    cards.appendChild(deleteButton)

}

async function editCard(id1,name1){

  editUrl='https://api.trello.com/1/cards/'+id1+'?name='+name1+'&key='+Key+'&token='+Token
    const resp = await fetch(editUrl, { method: 'PUT' });
    if (resp.ok){
        console.log("editWorked")
    }
    refreshPage();

}

async function deleteCard(id1){

    deleteUrl='https://api.trello.com/1/cards/'+id1+'?key='+Key+'&token='+Token
    const resp = await fetch(deleteUrl, { method: 'DELETE' });
    if (resp.ok) {
        console.log("deleteWorked")
    }
    refreshPage();
}

async function addCard(e,id1){
    let dummyCard=document.createElement('div')
    let dummyText=document.createElement('input')
    dummyText.type='text';
    let dummyAddButton=document.createElement('input')
    dummyAddButton.type='button'
    dummyAddButton.value='ADD'
    dummyAddButton.addEventListener('click',async function(e){
        e.preventDefault();
        let name1=e.target.previousSibling.value;
        e.stopPropagation();
        let addUrl='https://api.trello.com/1/cards?name='+name1+'&idList='+id1+'&keepFromSource=all&key='+Key+'&token='+Token;
        const resp = await fetch(addUrl, { method: 'POST' });
        if (resp.ok){
            console.log("addingWorked")
        }
        refreshPage();
    })
    let cancelAddButton=document.createElement('input')
    cancelAddButton.type='button'
    cancelAddButton.value='X'
    cancelAddButton.addEventListener('click',refreshPage)
    dummyCard.appendChild(dummyText);
    dummyCard.appendChild(dummyAddButton);
    dummyCard.appendChild(cancelAddButton);
    // e.target.appendChild(dummyCard)
    e.target.style.visibility = 'hidden';
    e.target.parentNode.appendChild(dummyCard)

}

async function addList(e){
    let dummyCard=document.createElement('div')
    let dummyText=document.createElement('input')
    dummyText.type='text';
    let dummyAddButton=document.createElement('input')
    dummyAddButton.type='button'
    dummyAddButton.value='ADD'
    dummyAddButton.addEventListener('click',async function(e){e.preventDefault();
        let name1=e.target.previousSibling.value;
        e.stopPropagation();
        let listUrl='https://api.trello.com/1/lists?name='+name1+'&idBoard='+boardId+'&pos=bottom&key='+Key+'&token='+Token;
        const resp = await fetch(listUrl, { method: 'POST' });
        if (resp.ok){
            console.log("adding_List_Worked")
        }
        refreshPage();})
    let cancelAddButton=document.createElement('input')
    cancelAddButton.type='button'
    cancelAddButton.value='X'
    cancelAddButton.addEventListener('click',refreshPage)
    dummyCard.appendChild(dummyText);
    dummyCard.appendChild(dummyAddButton);
    dummyCard.appendChild(cancelAddButton);
    // e.target.appendChild(dummyCard)
    e.target.style.visibility = 'hidden';
    e.target.parentNode.appendChild(dummyCard)
}
