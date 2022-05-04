const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

  if(li.parentElement.classList[1] === "top") {
    
    item.addEventListener('click', function () {
      allSideMenu.forEach(i=> {
        i.parentElement.classList.remove('active');
      })
      li.classList.add('active');
    });
  }
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('#menu-btn');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})



document.querySelector("#div-trigger-popup-delete").addEventListener("click", function(){
  document.querySelector('.hover_bg').style.display = 'block';
  document.querySelector('.popup-title').innerHTML = "Ești sigur că vrei sa ștergi prezența?";
  document.querySelector('.popup-text').innerHTML = "Această acțiune este ireversibilă si va șterge datele curente referitoare la prezență";
  document.querySelector('.popup-text').style.color = "black";

  document.querySelector("#add-admin-submit").style.display = 'none';
  document.querySelector("#email-add-admin").style.display = "none";
  document.querySelector("#yes-start-attendance").style.display = 'none';
  document.querySelector("#no-start-attendance").style.display = 'none';

  document.querySelector("#yes-delete").style.display = 'inline';
  document.querySelector("#no-delete").style.display = 'inline';

});
document.querySelector("#div-start-attendance").addEventListener("click", function(){
  document.querySelector('.hover_bg').style.display = 'block';
  document.querySelector('.popup-title').innerHTML = "Începe prezența";
  document.querySelector('.popup-text').innerHTML = "Vei iniția sesiunea de prezență (făcută prin sistemul QR).";
  document.querySelector('.popup-text').style.color = "black";

  document.querySelector("#add-admin-submit").style.display = 'none';
  document.querySelector("#email-add-admin").style.display = "none";
  document.querySelector("#yes-delete").style.display = 'none';
  document.querySelector("#no-delete").style.display = 'none';

  document.querySelector("#yes-start-attendance").style.display = 'inline';
  document.querySelector("#no-start-attendance").style.display = 'inline';

});

document.querySelector("#add-admin").addEventListener("click", function(){
  document.querySelector('.hover_bg').style.display = 'block';
  document.querySelector('.popup-title').innerHTML = "Add admin";
  
                  
  let content = document.querySelector('.popup-text');
  content.innerHTML = 'Introdu emailul persoanei care va avea drepturi de admin';
  content.style.color = "black";
  
  document.querySelector("#yes-delete").style.display = 'none';
  document.querySelector("#no-delete").style.display = 'none';
  document.querySelector("#yes-start-attendance").style.display = 'none';
  document.querySelector("#no-start-attendance").style.display = 'none';
  
  document.querySelector("#add-admin-submit").style.display = "inline";
  document.querySelector("#email-add-admin").style.display = "inline";
});

let isMouseOverHover = false;
document.querySelector(".hover_bg>div").addEventListener("mouseover", function () {
  isMouseOverHover = true;
});
document.querySelector(".hover_bg>div").addEventListener("mouseleave", function () {
  isMouseOverHover = false;
});
document.querySelector('.hover_bg').addEventListener("mousedown", function(){
  if(!isMouseOverHover) {
    document.querySelector('.hover_bg').style.display = 'none';
  }
});

document.querySelector('.popupCloseButton').addEventListener("click", function(){
    document.querySelector('.hover_bg').style.display = 'none';
});

const popup_btns = document.querySelectorAll('.popup-btn')
popup_btns.forEach(btn=> {
  btn.addEventListener("click", function(){
      document.querySelector('.hover_bg').style.display = 'none';
  });
});
// document.querySelector('#add-admin-submit').addEventListener("click", function(){
//     document.querySelector('.hover_bg').style.display = 'none';
// });




// window.addEventListener('resize', function () {
// 	if(this.innerWidth > 576) {
// 		searchButtonIcon.classList.replace('bx-x', 'bx-search');
// 		searchForm.classList.remove('show');
// 	}
// })



// const switchMode = document.getElementById('switch-mode');

// switchMode.addEventListener('change', function () {
// 	if(this.checked) {
// 		document.body.classList.add('dark');
// 	} else {
// 		document.body.classList.remove('dark');
// 	}
// })


//download-button

function exportReportToExcel() {
  let table = document.getElementsByTagName("table"); // you can use document.getElementById('tableId') as well by providing id to the table tag
  TableToExcel.convert(table[0], { // html code may contain multiple tables so here we are refering to 1st table tag
    name: `export.xlsx`, // fileName you could use any name
    sheet: {
      name: 'Sheet 1' // sheetName
    }
  });
}

//search

//Photo

function getPics() {} //just for this demo
const imgs = document.querySelectorAll('.gallery img');
const fullPage = document.querySelector('#fullpage');

imgs.forEach(img => {
  img.addEventListener('click', function() {
    fullPage.style.backgroundImage = 'url(' + img.src + ')';
    fullPage.style.display = 'block';
  });
});


/*
 
 */

'use strict';

class SortableTable {
  constructor(tableNode) {
    this.tableNode = tableNode;

    this.columnHeaders = tableNode.querySelectorAll('thead th');

    this.sortColumns = [];

    for (var i = 0; i < this.columnHeaders.length; i++) {
      var ch = this.columnHeaders[i];
      var buttonNode = ch.querySelector('button');
      if (buttonNode) {
        this.sortColumns.push(i);
        buttonNode.setAttribute('data-column-index', i);
        buttonNode.addEventListener('click', this.handleClick.bind(this));
      }
    }

    this.optionCheckbox = document.querySelector(
      'input[type="checkbox"][value="show-unsorted-icon"]'
    );

    if (this.optionCheckbox) {
      this.optionCheckbox.addEventListener(
        'change',
        this.handleOptionChange.bind(this)
      );
      if (this.optionCheckbox.checked) {
        this.tableNode.classList.add('show-unsorted-icon');
      }
    }
  }

  setColumnHeaderSort(columnIndex) {
    if (typeof columnIndex === 'string') {
      columnIndex = parseInt(columnIndex);
    }

    for (var i = 0; i < this.columnHeaders.length; i++) {
      var ch = this.columnHeaders[i];
      var buttonNode = ch.querySelector('button');
      if (i === columnIndex) {
        var value = ch.getAttribute('aria-sort');
        if (value === 'descending') {
          ch.setAttribute('aria-sort', 'ascending');
          this.sortColumn(
            columnIndex,
            'ascending',
            ch.classList.contains('num')
          );
        } else {
          ch.setAttribute('aria-sort', 'descending');
          this.sortColumn(
            columnIndex,
            'descending',
            ch.classList.contains('num')
          );
        }
      } else {
        if (ch.hasAttribute('aria-sort') && buttonNode) {
          ch.removeAttribute('aria-sort');
        }
      }
    }
  }

  sortColumn(columnIndex, sortValue, isNumber) {
    function compareValues(a, b) {
      if (sortValue === 'ascending') {
        if (a.value === b.value) {
          return 0;
        } else {
          if (isNumber) {
            return a.value - b.value;
          } else {
            return a.value < b.value ? -1 : 1;
          }
        }
      } else {
        if (a.value === b.value) {
          return 0;
        } else {
          if (isNumber) {
            return b.value - a.value;
          } else {
            return a.value > b.value ? -1 : 1;
          }
        }
      }
    }

    if (typeof isNumber !== 'boolean') {
      isNumber = false;
    }

    var tbodyNode = this.tableNode.querySelector('tbody');
    var rowNodes = [];
    var dataCells = [];

    var rowNode = tbodyNode.firstElementChild;

    var index = 0;
    while (rowNode) {
      rowNodes.push(rowNode);
      var rowCells = rowNode.querySelectorAll('th, td');
      var dataCell = rowCells[columnIndex];

      var data = {};
      data.index = index;
      data.value = dataCell.textContent.toLowerCase().trim();
      if (isNumber) {
        data.value = parseFloat(data.value);
      }
      dataCells.push(data);
      rowNode = rowNode.nextElementSibling;
      index += 1;
    }

    dataCells.sort(compareValues);

    // remove rows
    while (tbodyNode.firstChild) {
      tbodyNode.removeChild(tbodyNode.lastChild);
    }

    // add sorted rows
    for (var i = 0; i < dataCells.length; i += 1) {
      tbodyNode.appendChild(rowNodes[dataCells[i].index]);
    }
  }

  /* EVENT HANDLERS */

  handleClick(event) {
    var tgt = event.currentTarget;
    this.setColumnHeaderSort(tgt.getAttribute('data-column-index'));
  }

  handleOptionChange(event) {
    var tgt = event.currentTarget;

    if (tgt.checked) {
      this.tableNode.classList.add('show-unsorted-icon');
    } else {
      this.tableNode.classList.remove('show-unsorted-icon');
    }
  }


  
}

// Initialize sortable table buttons

// Delete button

$(".deleteMe").on("click", function(){
	$(this).closest("li").remove(); 
 });

 //2

 function SomeDeleteRowFunction() {
	// event.target will be the input element.
	var td = event.target.parentNode; 
	var tr = td.parentNode; // the row to be removed
	tr.parentNode.removeChild(tr);
}


// Initialize sortable table buttons
window.addEventListener('load', function () {
  var sortableTables = document.querySelectorAll('table.sortable');
  for (var i = 0; i < sortableTables.length; i++) {
    new SortableTable(sortableTables[i]);
  }
});






//sort+search

/*
$('#example thead th').each( function () {
	var title = $('#example tfoot th').eq( $(this).index() ).text();
	$(this).html( '&amp;lt;input type=&amp;quot;text&amp;quot; placeholder=&amp;quot;Search '+title+'&amp;quot; /&amp;gt;' );
} );

// DataTable
var table = $('#example').DataTable();

// Apply the search
table.columns().eq( 0 ).each( function ( colIdx ) {
	$( 'input', table.column( colIdx ).header() ).on( 'keyup change', function () {
		table
			.column( colIdx )
			.search( this.value )
			.draw();
	} );
} );
*/

//Efi's code: 

//Click on title = go to  main page
const homePage = document.getElementById("nav-title").addEventListener("click", function () {
  const indexURL = "/index.html";
  window.location.href = indexURL;
});