const primaryInputCedula =  document.getElementById('primary-input-cedula');
const primaryInputCudulaValidation = document.getElementById('primary-input-cedula-validation');
const primaryForm = document.getElementById('primary-form');
const secundaryForm = document.getElementById('secundary-form');
const secundaryInputCedula = document.getElementById('secundary-input-cedula');
const file = document.getElementById('secundary-input-teacher-foto');
const inputsSecundaryForm = document.querySelectorAll('#secundary-form input, #secundary-form textarea');
const textareaSecundaryForm = document.querySelector('#secundary-form textarea');
const sectionPrimaryForm  = document.getElementById('section-primary-form');
const sectionSecundaryForm  = document.getElementById('secundary-form-section');
const table = document.getElementById('table');
const sectionPrintPersons = document.getElementById('section-print-person');
const btnList = document.getElementById('btn-list');
const btnHome = document.getElementById('btn-home');
const wave = document.getElementById('wave');
const previewImgPc = document.getElementById('preview-photo');

const regularEspresion = {
    cedula : /[0-9]/,
    correo : /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
}
arrayPersons =[];
let simplePerson ={};

let setCedula = (e)=>{
    e.preventDefault();
    if(primaryFormValidation()){
        var btnAceptar = document.getElementById('btnAceptar');
        spinner(btnAceptar,'cargando...',true);
        fetchPerson(primaryInputCedula.value,(data)=>{
            if(data===null){
                spinner(btnAceptar,'Aceptar',false);
                alert('Ha habido un problema');       
            }
            else if(!data.ok){
                spinner(btnAceptar,'Aceptar',false);
                alert('Por favor revise los datos introducidos')
            }
            else{
                secundaryInputCedula.value =data.Cedula;
                simplePerson.names = data.Nombres;
                simplePerson.surnames = data.Apellido1+' '+data.Apellido2;
                simplePerson.dateBirth = data.FechaNacimiento;
                simplePerson.photo = data.foto;
                simplePerson.gender = data.IdSexo;
                spinner(btnAceptar,'Aceptar',false);
                primaryForm.reset();
                elemetsDisplay('none','none','block',
                'none','felx','flex','none');
            }
        })
    }
}

let  spinner = (btn, data, desabled)=>{
    if(desabled===true){
        btn.disabled = desabled;
        btn.childNodes[1].className= 'spinner-border spinner-border-sm';
        btn.childNodes[2].data =data;
    }else{
        btn.disabled = desabled;
        btn.childNodes[1].className= '';
        btn.childNodes[2].data =data;
    }
}




let primaryFormValidation = ()=>{
   var input = primaryForm.childNodes[1].childNodes[1].childNodes[3];
   var message = 'Solo se aceptan valores numericos';
   var divValidation = primaryForm.childNodes[1].childNodes[1].childNodes[5];
   var isValid = validateInputsWithRe(regularEspresion.cedula, input, message, divValidation);
   var isEmpty =  inputOrTesxAreaIsEmpty(input, divValidation);
   if(!isEmpty && isValid && !cedulaIsRegistrared(input.value)){
       return true;
   }
   return false ;
}

let cedulaIsRegistrared = (cedula)=>{
    var valueReturn = false;
    for (let index = 0; index < arrayPersons.length; index++) {
        if(arrayPersons[index].cedula==cedula){
            alert('Este profesor ya esta registrado!');
            primaryForm.reset();
            valueReturn = true;
            break;
        }
    }
    return valueReturn;
}

let secundaryFormValidation = ()=>{
    var countValidator  = 0; 
    var isEmpty;
    var isValid;  
    inputsSecundaryForm.forEach(element => {
        console.log(element);
        switch(element.name){   
            case 'correo':
                isValid = validateInputsWithRe(regularEspresion.correo,element,
                         'No es un correo',element.parentNode.childNodes[5]);
                isEmpty = inputOrTesxAreaIsEmpty(element, element.parentNode.childNodes[5]);
                    if(!isEmpty && isValid){
                        countValidator++;
                        break;
                    }else break;

            case 'escuela':
                isEmpty = inputOrTesxAreaIsEmpty(element,element.parentNode.childNodes[5]);
                    if(!isEmpty){
                        countValidator++;
                        break;
                    }else break;

            case 'teacher-foto':
                isEmpty = inputOrTesxAreaIsEmpty(element,element.parentNode.childNodes[5]);
                        if(!isEmpty){
                            countValidator++;
                            break;
                        } 
                        else break;
                        
            case 'textarea-description':
                isEmpty = inputOrTesxAreaIsEmpty(element,element.parentNode.childNodes[5]);
                        if(!isEmpty){
                            countValidator++;
                            break; 
                        }       
                        else break;        
        }
    });  
    if(countValidator==4) 
        return true;
    else return false;
    
}



let validateInputsWithRe = (regularExpresion, input, message, divValidation) =>{
    if(regularExpresion.test(input.value)){
        input.classList.remove('is-invalid');
        divValidation.classList.remove('invalid-feedback');
        return true;
    }else{
        input.classList.add('is-invalid');
        divValidation.classList.add('invalid-feedback');
        divValidation.innerHTML =message;
        return false;
    }
}


let inputOrTesxAreaIsEmpty = (element,divValidation)=>{
    if(element.value===''){
        element.classList.add('is-invalid');
        divValidation.classList.add('invalid-feedback');
        divValidation.innerHTML ='No se acepan campos vacios';
        return true;
    }    
    return false;
}



let fetchPerson =(cedula, callback)=>{
    const url= 'https://api.adamix.net/apec/cedula/';
    fetch(url+cedula).then(res =>res.json())
    .then(data => {
        if(data.ok){
            console.log('SUCCESS');
            callback(data);
        }else if(!data.ok){
            callback(data);
        }else{
            callback(null);
        }
    })
    .catch(error=> console.log('ERROR'));
}


file.addEventListener('change',function(){
    const reader = new FileReader();
    var divPreviePhoto = document.getElementById('preview-photo');
    reader.addEventListener('load',()=>{
        simplePerson.photoTeacherPc = reader.result;
        if(/(data:image)/g.test(reader.result)){
            divPreviePhoto.setAttribute('src',reader.result);
            elemetsDisplay('none','none','block',
            'none','flex','flex','block');
        }else{
            alert('Introduzca un archivo valido (imagen)');
            divPreviePhoto.setAttribute('src','');
            file.value='';
        } 
        console.log(reader);      
    });
    reader.readAsDataURL(this.files[0]);
});


let saveLocalStorage =()=>{
    try{
    localStorage.setItem('persons',JSON.stringify(arrayPersons));
    }catch(error){
        alert('Ha ocurrido un problema');
    }
}


let readLocalStorage =()=>{
    document.getElementById('tbody-persons').innerHTML='';
    arrayPersons = JSON.parse(localStorage.getItem('persons'));
    if(arrayPersons===null){
        arrayPersons =[];
    }else{
        for (let i = 0; i < arrayPersons.length; i++) { 
            inputsTableReadOnly(arrayPersons,i) ;
        }
        
    }
}

let editPerson =(e)=>{
    var i = e.parentNode.parentNode.childNodes[1].innerHTML;
    document.getElementById('tbody-persons').innerHTML='';
    for (let index = 0; index < arrayPersons.length; index++) {
        if(index+1==i){
            inpuntsTable(arrayPersons,index);
        }else{
            inputsTableReadOnly(arrayPersons,index);
        }       
    }
}


let cancelEdit = ()=>{
    readLocalStorage();
}


let confirmEdit =(e)=>{
    var i = e.parentNode.parentNode.childNodes[1].innerHTML;
    arrayPersons[i-1].cedula = document.getElementsByName('table-cedula')[i-1].value; 
    arrayPersons[i-1].names = document.getElementsByName('table-nombres')[i-1].value;
    arrayPersons[i-1].surnames = document.getElementsByName('table-apellidos')[i-1].value;
    arrayPersons[i-1].dateBirth = document.getElementsByName('table-fecha-nacimiento')[i-1].value;
    arrayPersons[i-1].gender = document.getElementsByName('table-sexo')[i-1].value;
    arrayPersons[i-1].email = document.getElementsByName('table-correo')[i-1].value;
    arrayPersons[i-1].eschool = document.getElementsByName('table-escuela')[i-1].value;
    saveLocalStorage();
    readLocalStorage();

}


let printPerson = (e)=>{
    var i = e.parentNode.parentNode.childNodes[1].innerHTML;
    var i = i-1;
    document.getElementById('perfil-photo').setAttribute('src',arrayPersons[i].photo);
    document.getElementById('cedula-print').innerHTML = arrayPersons[i].cedula;
    document.getElementById('nombres-print').innerHTML = arrayPersons[i].names;
    document.getElementById('apellidos-print').innerHTML = arrayPersons[i].surnames;
    document.getElementById('fecha-nacimiento-print').innerHTML = arrayPersons[i].dateBirth;
    document.getElementById('sexo-print').innerHTML =arrayPersons[i].gender;
    document.getElementById('correo-print').innerHTML = arrayPersons[i].email;
    document.getElementById('descripcion-pc-print').innerHTML = arrayPersons[i].computerDescription;
    document.getElementById('escuela-print').innerHTML =arrayPersons[i].eschool;
    document.getElementById('foto-computer-print').setAttribute('src',arrayPersons[i].photoTeacherPc);
    elemetsDisplay('none','none','none',
    'block','flex','flex','none');
}


let  personRegister = (e)=>{
    e.preventDefault();
    if(secundaryFormValidation()){
    simplePerson.cedula=inputsSecundaryForm[0].value;
    simplePerson.email = inputsSecundaryForm[1].value;
    simplePerson.eschool = inputsSecundaryForm[2].value;
    simplePerson.computerDescription = textareaSecundaryForm.value;
    arrayPersons.push(simplePerson);
    saveLocalStorage();
    readLocalStorage();
    secundaryForm.reset();
    elemetsDisplay('table','none','none',
    'none','none','felx','none');
    }
}

let gotToTable = ()=>{
    if(arrayPersons.length>0){
        elemetsDisplay('table','none','none',
        'none','none','flex','none');
        readLocalStorage();
    }else{
        alert('Aún no hay profesores registrados');
    }
}

let goToHome =()=>{
    elemetsDisplay('none','block','none',
    'none','flex','none','none');
}

let deleteErrorMessage=(e)=>{
    //div error
    elementDiv = e.target.parentNode.childNodes[5];
    elementInputOrTextArea = e.target;
    switch(e.target.name){
        case 'cedula':
            deleteErrorClass(elementInputOrTextArea,
                elementDiv); 
            break;
        case 'correo':
            deleteErrorClass(elementInputOrTextArea,
                elementDiv); 
            break;

        case 'escuela':
            deleteErrorClass(elementInputOrTextArea,
                elementDiv); 
            break;
        case 'textarea-description':
            deleteErrorClass(elementInputOrTextArea,
                elementDiv); 
            break;
        case 'teacher-foto':
            deleteErrorClass(elementInputOrTextArea,
                elementDiv); 
            break;
    }
}

let deleteErrorClass = (elementInputOrTextArea,
     elementDiv)=>{
    elementInputOrTextArea.classList.remove('is-invalid');
    elementDiv.classList.remove('invalid-feedback');
    elementDiv.innerHTML='';
}


let elemetsDisplay=(tableDisplay,
    sectionPrimaryFormDisplay,
    sectionSecundaryFormDisplay,
    sectionPrintPersonasDisplay,
    btnListDisplay,btnHomeDisplay,
    previewimgDisplay)=>{

    table.style.display =tableDisplay;
    sectionPrimaryForm.style.display =sectionPrimaryFormDisplay;
    sectionSecundaryForm.style.display =sectionSecundaryFormDisplay;
    sectionPrintPersons.style.display = sectionPrintPersonasDisplay;
    btnList.style.display=btnListDisplay;
    btnHome.style.display=btnHomeDisplay;  
    previewImgPc.style.display = previewimgDisplay;
    wave.style.marginTop='30vh';
}


/* listerners
 */

btnList.addEventListener('click',gotToTable);
btnHome.addEventListener('click',goToHome);

document.addEventListener('DOMContentLoaded',function(){
    readLocalStorage();
}
);

secundaryForm.addEventListener('submit', personRegister);
primaryForm.addEventListener('submit',setCedula);
primaryForm.addEventListener('keyup',deleteErrorMessage);
secundaryForm.addEventListener('keyup',deleteErrorMessage);

/* templates */

let inputsTableReadOnly =(arrayPersons,i)=>{
    document.getElementById('tbody-persons').innerHTML+=
            `<tr>
            <th scope="col">${i+1}</th>
            <td><input type="text" value="${arrayPersons[i].cedula}" name="table-cedula" readonly class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].names}" name="table-nombres" readonly class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].surnames}" name="table-apellidos" readonly class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].dateBirth}" name="table-fecha-nacimiento" readonly class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].gender}" name="table-sexo" readonly class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].email}" name="table-correo" readonly class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].eschool}" name="table-escuela" readonly class="form-control form-control-sm"></td> 
            <td><i class="fas fa-edit" onclick="editPerson(this)" ></i></td>
            <td><i class="fas fa-print" onclick="printPerson(this)"></i></td>
        </tr> `;  
}


let inpuntsTable =(arrayPersons,i)=>{
    document.getElementById('tbody-persons').innerHTML+=
            `<tr>
            <th scope="col">${i+1}</th>
            <td><input type="text" value="${arrayPersons[i].cedula}" name="table-cedula"  class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].names}" name="table-nombres"  class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].surnames}" name="table-apellidos"  class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].dateBirth}" name="table-fecha-nacimiento"  class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].gender}" name="table-sexo"  class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].email}" name="table-correo"  class="form-control form-control-sm"></td> 
            <td><input type="text" value="${arrayPersons[i].eschool}" name="table-escuela"  class="form-control form-control-sm"></td> 
            <td><i class="fas fa-check" onclick="confirmEdit(this)"></i></td>
            <td><i class="fas fa-ban" onclick="cancelEdit(this)"></i></td>
        </tr> `; 
}