function NotesStore() {
  var key = 'notes';
  this.subscribers = [];

  this.add = function (note) {
    var notes = this.all();
    notes.push(note);
    localStorage.setItem(key, JSON.stringify(notes));
    this.render();
  };

  this.edit = function (index, note) {
    var allNotes = this.all();
    allNotes[index] = note;
    localStorage.setItem(key, JSON.stringify(allNotes));
    this.render();
  };

  this.all = function () {
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  this.deleteAll = function () {
    localStorage.setItem(key, "[]");
  };

  this.notify = function (e) {

    if (e.key == key) {
      console.log("local storage changed!!!");
      var notes = JSON.parse(e.newValue);
      this.render();
      for (var i = 0; i < this.subscribers.length; i++) {
        this.subscribers[i](notes);
      }
    }
  };


  this.subscribe = function (func) {
    this.subscribers.push(func);
  };

  window.addEventListener('storage', this.notify.bind(this), false);

  this.render = function () {
    var notesView = new NotesListView();
    notesView.render(this.all());
  };

}

function Note(title, body) {
  this.title = title;
  this.body = body;
}

function AppView(id, storage) {
  this.id = id;
  this.render = function () {
    var div = document.createElement('div');
    div.innerHTML = '<div class="container">\
                      <div id="notes"></div>\
                      <div class="b-inputMessage">\
                        <input id="noteTitle" type="text" class="form-control" placeholder="Your note title">\
                        <textarea id="noteBody" class="form-control" placeholder="Your note text" rows="3"></textarea>\
                        <button id="noteAdd" type="button" class="btn btn-primary">Add note</button>\
                      </div>\
                     </div>\
                     <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\
                       <div class="modal-dialog" role="document">\
                         <div class="modal-content">\
                           <div class="modal-header">\
                             <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                             <h4 class="modal-title" id="myModalLabel">Edit your note</h4>\
                           </div>\
                           <div class="modal-body">\
                             <input id="idNote" type="text" class="form-control hide">\
                             <input id="noteTitleEdit" type="text" class="form-control" placeholder="Your note title">\
                             <textarea id="noteBodyEdit" class="form-control" placeholder="Your note text" rows="3"></textarea>\
                           </div>\
                           <div class="modal-footer">\
                             <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
                             <button id="saveEdit" type="button" class="btn btn-primary">Save changes</button>\
                           </div>\
                         </div>\
                       </div>\
                     </div>';
    document.getElementById(this.id).appendChild(div);
    document.getElementById('noteAdd').addEventListener('click', function (e) {
      var note = new Note(document.getElementById('noteTitle').value, document.getElementById('noteBody').value);
      storage.add(note);
      document.getElementById('noteTitle').value = '';
      document.getElementById('noteBody').value = '';
    });
    document.getElementById('saveEdit').addEventListener('click', function (e) {
      var note = new Note(document.getElementById('noteTitleEdit').value, document.getElementById('noteBodyEdit').value);
      storage.edit(document.getElementById('idNote').value, note);
      $('#myModal').modal('hide');
    });
  };
}

function NoteView(index) {
  this.render = function (note) {
    return '<h3>' + note.title + '</h3> \
            <p>'+ note.body + '</p>\
            <a id="id'+ index + '" href="#" data-toggle="modal" data-target="#myModal"><span class="glyphicon glyphicon-pencil"></span> edit</a>';
  };
}

function NotesListView() {
  this.render = function (notes) {
    document.getElementById('notes').innerHTML = '';
    notes.forEach(function (item, index) {
      var notesDiv = document.createElement('div');
      var note = new NoteView(index);
      notesDiv.innerHTML = note.render(item);
      document.getElementById('notes').appendChild(notesDiv);
      document.getElementById('id' + index).addEventListener('click', function (e) {
        document.getElementById('noteTitleEdit').value = item.title;
        document.getElementById('noteBodyEdit').value = item.body;
        document.getElementById('idNote').value = index;
      });

    });
  };
}




var notes = new NotesStore();
notes.subscribe(function (items) {
  console.log("changed: " + JSON.stringify(items));
});

var app = new AppView('app', notes);
app.render();
notes.render();
