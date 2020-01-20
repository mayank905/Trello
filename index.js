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

                numberOfCard=listContent.cards.length;

                for(let j=0;j<numberOfCard;j++){
                     cards=document.createElement('div');
                     let checklistid=listContent.cards[j].idChecklists[0]
                     cards.cardId=listContent.cards[j].id
                     cards.className='cards';
                     refreshCards(cards,listContent.cards[j],checklistid);
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

function refreshCards(cards,result3,checklistid){
    let textDiv=document.createElement('div')
    let textNode=document.createTextNode(result3.name+'')
    textDiv.appendChild(textNode)
    textDiv.contentEditable=true;

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
    // cards.addEventListener('click',function(e){dummymodal(e)})
    cards.addEventListener('click',function(e){
        if(e.target.classList.contains('cards')){
            let cardId=e.target.cardId
        cardModal(e,cardId)}})


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


async function cardModal(e,cardId){
    e.stopPropagation();
    let footer=document.getElementById('footer')
    while (footer.hasChildNodes()) {
        footer.removeChild(footer.firstChild);
    }
    let modal=document.createElement('div')
    modal.className='modal'
    modal.id='myModal'
    let modalContent=document.createElement('div')
    modalContent.className='modal-content'
    modal.appendChild(modalContent)
    let cardDetail=document.createElement('div')
    cardDetail.className='cardDetail'
    let checklistDetail=document.createElement('div')
    checklistDetail.className='checklistDetail'

    cardUrl='https://api.trello.com/1/cards/'+cardId+'?key='+Key+'&token='+Token;
    response=await fetch(cardUrl)
    if(response.ok){
        cardResult=await response.json()
        console.log(cardResult)
    }
    checkListUrl='https://api.trello.com/1/cards/'+cardId+'/checklists?checkItems=all&checkItem_fields=all&filter=all&fields=all&key='+Key+'&token='+Token;
    response=await fetch(checkListUrl)
    if(response.ok){
        result=await response.json()
        console.log(result)
        result1=JSON.stringify(result)
    }
    ////

    let descdiv=document.createElement('div')
    let heading=document.createElement('h3')
    let headingContent=document.createTextNode("Description")
    heading.appendChild(headingContent)
    descdiv.appendChild(heading)
    let textdiv=document.createElement('div')
    let textArea = document.createTextNode(cardResult.desc)
    textdiv.appendChild(textArea)

    cardDetail.appendChild(descdiv)
    cardDetail.appendChild(textdiv)
    for(let k=0;k<result.length;k++)
    {
        let t=k+1
        console.log(result[k])
        let checkList=document.createElement('div')
        checkList.id=result[k].id
        checkList.className='checkList'
        let checkListTitleDiv=document.createElement('div');
        let chekListTitle=document.createTextNode(''+(result[k].name))
        checkListTitleDiv.appendChild(chekListTitle)
        checkListTitleDiv.contentEditable=true
        let deleteCheckList=document.createElement('input')
        deleteCheckList.type='button'
        deleteCheckList.value='Delete_Check_List'
        deleteCheckList.addEventListener('click',function(e){deleteCheckListf(e,cardId)})
        checkList.appendChild(checkListTitleDiv)
        checkList.appendChild(deleteCheckList)
        for(let l=0;l<result[k].checkItems.length;l++){
            console.log(result[k].checkItems[l])
            let checkItem=document.createElement('div')
            checkItem.addEventListener('click',function(e){refreshCheckItem(e,cardId)})
            checkItem.id=result[k].checkItems[l].id
            checkItem.className='checkItem'
            let checkItemName=document.createTextNode(result[k].checkItems[l].name)
            checkItem.appendChild(checkItemName)
            let checkbox=document.createElement('input')
            checkbox.type='checkbox'
            checkbox.className='checkbox'
            if(result[k].checkItems[l].state=='complete'){
                checkbox.checked=true;
                checkItem.style.textDecoration='line-through'
            }
            else if(result[k].checkItems[l].state=='incomplete'){
                checkbox.checked=false;
            }
            checkItem.appendChild(checkbox)
            let deleteCheckItem=document.createElement('input')
            deleteCheckItem.type='button'
            deleteCheckItem.value='Delete'
            deleteCheckItem.className='deleteCheckItem'
            deleteCheckItem.addEventListener('click',function(e){deleteCheckListItem(e,cardId)})
            checkItem.appendChild(deleteCheckItem)
            checkList.appendChild(checkItem)

        }
        let button=document.createElement('input')
        button.type='button'
        button.value='Add_List_Item'
        button.className='button'
        button.addEventListener('click',function (e){addCheckItem(e,cardId)})
        checkList.appendChild(button)
        checklistDetail.appendChild(checkList)
    }
    let addCheckList=document.createElement('input')
    addCheckList.type='button'
    addCheckList.value='Add_Check_List'
    addCheckList.className='addCheckList'
    addCheckList.addEventListener('click',function(e){addCheckListf(e,cardId)})
    modalContent.appendChild(cardDetail)
    modalContent.appendChild(checklistDetail)
    modalContent.appendChild(addCheckList)
    footer.appendChild(modal);
}
window.onclick = function(event) {
    if (event.target.id == 'myModal') {
        event.target.style.display = "none";
    }
}
async function deleteCheckListf(e,cardId){
    let id=e.target.parentNode.id
    let url='https://api.trello.com/1/checklists/'+id+'?key='+Key+'&token='+Token
    let resp = await fetch(url, { method: 'DELETE' });
    if (resp.ok){
        console.log("DeleteCheckListWorked")
        cardModal(e,cardId)
    }

}
async function addCheckListf(e,cardID) {
    let id = e.target.parentNode.id;
    console.log(id)
    e.target.style.display = 'none'
    let insertName = document.createElement('input')
    insertName.type = 'text'
    e.target.parentNode.appendChild(insertName)
    let insertButton = document.createElement('input')
    insertButton.type = 'button'
    insertButton.value = 'insert'

    insertButton.addEventListener('click', function (e) {
        let name = e.target.previousSibling.value;
        insertCheckList(e, name, cardID)
    })
    e.target.parentNode.appendChild(insertButton)
}
async function insertCheckList(e,name,cardID){
    let url='https://api.trello.com/1/checklists?idCard='+cardID+'&name='+name+'&key='+Key+'&token='+Token
    let resp = await fetch(url, { method: 'POST' });
    if (resp.ok){
        console.log("AddCheckListWorked")
    }
    cardModal(e,cardID)
}
async function refreshCheckItem(e,cardId){
    let idCheckItem=e.target.parentNode.id
    if(e.target.classList.contains('checkbox')){
        //checkboxdiv=document.getElementById(e.target.id)

        if(e.target.checked==false){
            e.target.parentNode.style.textDecoration='none'
            let state='incomplete'
            let updateCheckItemUrl='https://api.trello.com/1/cards/'+cardId+'/checkItem/'+idCheckItem+'?state='+state+'&key='+Key+'&token='+Token
            let resp = await fetch(updateCheckItemUrl, { method: 'PUT' });
            if (resp.ok){
                console.log("CheckBoxItemWorked")
            }


        }
        else if(e.target.checked==true){
            e.target.parentNode.style.textDecoration='line-through'
            let state='complete'
            let updateCheckItemUrl='https://api.trello.com/1/cards/'+cardId+'/checkItem/'+idCheckItem+'?state='+state+'&key='+Key+'&token='+Token
            let resp = await fetch(updateCheckItemUrl, { method: 'PUT' });
            if (resp.ok){
                console.log("CheckBoxItemWorked")
            }

        }
    }
}

function addCheckItem(e,cardId){
    let id =e.target.parentNode.id;
    console.log(id)
    e.target.style.display='none'
    let insertName=document.createElement('input')
    insertName.type='text'
    e.target.parentNode.appendChild(insertName)
    let insertButton=document.createElement('input')
    insertButton.type='button'
    insertButton.value='insert'

    insertButton.addEventListener('click',function(e){
        let name=e.target.previousSibling.value;
        insertCheckItem(e,id,name,cardId)})
    e.target.parentNode.appendChild(insertButton)


}
async function insertCheckItem(e,id,name,cardId){

    let AddListItemUrl='https://api.trello.com/1/checklists/'+id+'/checkItems?name='+name+'&pos=bottom&checked=false&key='+Key+'&token='+Token
    let resp = await fetch(AddListItemUrl, { method: 'POST' });
    if (resp.ok){
        console.log("insertCheckItemWorked")
    }
    cardModal(e,cardId)
}

async function deleteCheckListItem(e,cardId){
    id=e.target.parentNode.parentNode.id
    idCheckItem=e.target.parentNode.id
    delteCheckItemUrl='https://api.trello.com/1/checklists/'+id+'/checkItems/'+idCheckItem+'?key='+Key+'&token='+Token
    let resp = await fetch(delteCheckItemUrl, { method: 'DELETE' });
    if (resp.ok){
        console.log("DeleteCheckItemWorked")
    }
    cardModal(e,cardId)
}
