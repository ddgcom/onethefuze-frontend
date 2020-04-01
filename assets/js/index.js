/**
 * Lasyload init
 */
let lazyLoadInstance = new LazyLoad({
  elements_selector: "img",
  callback_finish: function(e) {
    document.querySelectorAll('.grid-item').forEach(target => {
      let iconDelete = document.createElement('i')
      iconDelete.setAttribute('class','fa fa-trash');
      target.appendChild(iconDelete);
      iconDelete.addEventListener("click", (event) => { 
        let target = event.target || event.srcElement;
        target.parentElement.remove();
        BuildTools();
      }, true);
    });
    BuildTools(); console.log('ready');
  }
});

/**
 * Events
 */

async function Message(text, position, type){
  let wrapper = document.createElement('div');
  wrapper.setAttribute('class','alert alert-'+type);
  wrapper.setAttribute('role','alert');
  wrapper.setAttribute('style','margin: 10px 0');
  wrapper.appendChild( document.createTextNode(text));
  position.appendChild(wrapper);

  setTimeout(function(){ 
    wrapper.remove();
  }, 8000);
}

async function logSubmit(event) {
  event.preventDefault();
  let position = event.target;
  // Validation
  let file = document.getElementById("image");
  let url_img = document.getElementById("url_image").value;
  let category = document.getElementById("category").value.replace(/ +(?= )/g,'');
  
  if (file.value == '' && url_img == ''){
    Message('No hay una imagen valida', position, 'warning');
  } else if(category === '') {
    Message('Categoria no valida', position, 'warning');
  } else {
    let category_i = category.split(' ').join('_'); 
    let photo = (file.value != '') ? URL.createObjectURL(file.files[0]) : url_img;

    // BUILD IMAGE
    let wrapper = document.createElement('div');
    wrapper.setAttribute('class','grid-item element-item '+category_i);
    wrapper.setAttribute('id','item-'+category_i);
    let image = document.createElement('img');
    image.setAttribute('class','animated bounceInDown delay-3s');
    image.setAttribute('data-src', photo);

    // convert to base64 strin
    image.setAttribute('src', photo);
    if (file.value != ''){
      image.onload = function() {
        URL.revokeObjectURL(image.src) // free memory
      }
    }
    wrapper.appendChild(image);

    // delete photo
    let iconDelete = document.createElement('i')
    iconDelete.setAttribute('class','fa fa-trash');
    wrapper.appendChild(iconDelete);
    iconDelete.addEventListener("click", (event) => { 
      let target = event.target || event.srcElement;
      target.parentElement.remove();
      BuildTools();
    }, true);

    document.getElementById('grid').appendChild(wrapper);

    Message('Guardado', position, 'success');
    // Update Tools
    BuildTools();
  }

}
document.getElementById('form').addEventListener('submit', logSubmit);

async function BuildTools(){
  const tools = document.querySelectorAll('.grid-tools')[0];
  let wrapper = document.createElement('select');
  wrapper.setAttribute('class','form-control filter-select');
  wrapper.addEventListener("change", (event) => {
    window.location.hash=event.target.value;
  });
  let array = [];
  tools.innerHTML = '';
  tools.append(wrapper);

  let opt = document.createElement('option');
  opt.appendChild( document.createTextNode('Todos'));
  opt.value = '#';
  wrapper.appendChild(opt);
  
  document.querySelectorAll('.grid > div').forEach(element => {
    let ClassNames = element.classList;
    ClassNames.forEach(async function(ClassName) {			
      if (array.indexOf(ClassName) === -1 && ClassName != 'grid-item' && ClassName != 'element-item'){ 
        array.push(ClassName);
        let title = ClassName.split('_').join(' ');
        let opt = document.createElement('option');
        opt.appendChild( document.createTextNode(title));
        opt.value = '#'+ClassName;
        document.getElementsByClassName('filter-select')[0].appendChild(opt);
      }	
    })
  });
}

async function showAllItems(){
  document.querySelectorAll('.grid > div').forEach(element => element.removeAttribute('style'));
}

async function filterItems(item, stlye_display){
  let className = item.replace("#", ".");
  const categories = document.querySelectorAll('.grid > div'+className);
  document.querySelectorAll('.grid > div:not('+className+')').forEach(element => element.style.display="none");
  if (categories.length > 1){
    categories.forEach(element => element.style.display="inherit");
  } else if(categories.length > 0) {
    categories.forEach(element => element.removeAttribute('style'));  
  } else {
    showAllItems();
  }
}

async function OnlyItem(item){
  document.querySelectorAll('.grid > div:not('+item+')').forEach(element => element.style.display = "none");
  document.querySelector(item.toString()).removeAttribute('style');
}

async function handleUrlTarget() {
  try {
    const item = await location.hash;
    const re = new RegExp("\\bitem-\\b");
    if (re.test(item)){
      OnlyItem(item);
    } else if (item){
      filterItems(item);
    } else {
      showAllItems();
    }
  }
  catch (err) {
    console.log('handle url failed', err);
  }
}
window.addEventListener('hashchange', handleUrlTarget, false);