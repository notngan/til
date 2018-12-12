// setInterval(function(){location.reload(true);}, 5000);
window.onload = function () {
  const db = firebase.database();  

  const input = document.getElementById('input-til');
  const message = document.getElementById('message');
  const link = document.getElementById('input-link');
  const date = document.getElementById('date-til');
  const btnAdd = document.getElementById('btn-add');
  const btnSubmit = document.getElementById('btn-submit');
  const indexPage = document.getElementById('index');
  const indexMain = document.getElementById('index-main');

  // GET DATA
  getData();

  function getData () {
    db.ref('tils').once('value').then(function (snap) { 
      const data = [];
      const json = snap.val();
      
      for (key in json) {
        data.push({
          id: Object.keys(json).indexOf(key) + 1,
          til: json[key].til,
          date: json[key].date,
          time: json[key].time,
        })
      }
      //console.log(data)
      // <article>
      //   <h2>2018/12/11, til</h2> 
      //   <p class="mb-0"><span>&#x268A;</span>that `addEventListener('click', ... )` in JavaScript is <a href="https://stackoverflow.com/questions/6348494/addeventlistener-vs-onclick">different</a> from `onclick` because it doesn't overwrite existing event handlers, whereas `onclick` does.
      //   </p>
      //   <p class="mt-0 text-right"><small>15:11</small></p>
      // </article>
      data.forEach((item) => {
        let article = document.createElement('article');
        let h2 = document.createElement('h2');
        let p = document.createElement('p');
        let ptime = document.createElement('p');
        
        h2.innerHTML = `${item.date}, til`;
        p.innerHTML = `<span class="add-margin">&#x268A;</span>${item.til}`;
        p.classList.add('mb-0');
        ptime.innerHTML = `<small>${item.time}</small>`;
        ptime.classList.add('mt-0', 'text-right');

        article.appendChild(h2);
        article.appendChild(p);
        article.appendChild(ptime);

        indexMain.appendChild(article);
      });
      //console.log(indexMain)
    });
  }


  // GET TIME
  function getTime (time) {
    if (time < 10) {
      return '0' + time;
    } else return time;
  }

  if (input) {
    // ADD LINK
    btnAdd.addEventListener('click', function () {
      let selected = document.getSelection().toString();
      let a = document.createElement('a');
      
      if (selected.length > 0 && link.value !== '') {

        a.href = link.value;
        a.target = '_blank';

        document.getSelection().getRangeAt(0).surroundContents(a);
        link.value = '';
        message.innerHTML = '';
        //console.log(input.innerHTML);
      } else if (link.value == ''){
        message.innerHTML = 'link is invalid';
      } else {
        message.innerHTML = 'no text is selected';
      }
    })

    // SUBMIT 
    btnSubmit.addEventListener('click', function(e) {
      e.preventDefault();
      if (input.innerHTML !== '') {
        let hh = new Date().getHours();
        let mm = new Date().getMinutes();
        getTime(hh);
        getTime(mm);
        const data = {
          date: new Date().toISOString().substring(0,10), 
          time: getTime(hh) + ':' + getTime(mm),
          til: input.innerHTML,
        }
        db.ref('tils/').push(data).then(function () {
          console.log(data);
          input.innerHTML = '';
          link.value = '';
        }).catch(function (error) {
          console.log(error);
        });
      }
    })
  }

  if (date) {
    date.innerHTML = new Date().toISOString().substring(0,10); 
  }


  
}