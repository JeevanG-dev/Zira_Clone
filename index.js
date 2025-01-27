let boards = [];
let currentBoardId = null;

const createBoardBtn = document.getElementById("createBoardBtn");
const boardList = document.getElementById("boardList");
const boardDetails = document.getElementById("boardDetails");

const modelOverlay = document.getElementById("modelOverlay");
const modelContent = document.getElementById("modelContent");
const modelInput = document.getElementById("modelInput");
const modelTitle = document.getElementById("modelTitle");
const modelContextType = document.getElementById("modelContextType");
const modelContextId = document.getElementById("modelContextId");
const modelSaveBtn = document.getElementById("modelSaveBtn");
const modelCancelBtn = document.getElementById("modelCancelBtn");

createBoardBtn.addEventListener("click", () => {
  OpenModel({
    title: "Create Board",
    contextType: "createBoard",
  });
});

modelCancelBtn.addEventListener("click", () => {
  closeModel();
});

modelSaveBtn.addEventListener("click", () => {
  handleModelSave();
});

function OpenModel({ title, defaultValue = "", contextType, contextId = "" }) {
  modelTitle.textContent = title;
  modelInput.value = defaultValue;
  modelContextType.value = contextType;
  modelContextId.value = contextId;

  modelOverlay.style.display = "flex";
  modelInput.focus();
}

function closeModel() {
  modelOverlay.style.display = "none";
  modelInput.value = "";
  modelContextType.value = "";
  modelContextId.value = "";
}

function handleModelSave() {
  const nameValue = modelInput.value.trim();
  const type = modelContextType.value;
  const id = modelContextId.value;

  if (!nameValue) {
    alert("Please enter your name");
    return;
  }

  switch (type) {
    case "createBoard":
      createBoard(nameValue);
      break;

    case "createColumn":
      createColumn(currentBoardId, nameValue);
      break;

    case "editColumn":
      editColumn(id, nameValue);
      break;

    case "createTicket":
      createTicket(id, nameValue);
      break;

    case "editTicket":
      editTicket(id, nameValue);
      break;
  }

  closeModel();
}

function generateId(prefix) {
  return prefix + `-${Math.floor(Math.random() * 10000000)}`;
}

function createBoard(nameValue) {
  const newBoard = {
    id: generateId("board"),
    name: nameValue,
    columns: [],
  };

  boards.push(newBoard);
  renderList();
  selectedBoard(newBoard.id);
}

function selectedBoard(boardId) {
  currentBoardId = boardId;
  renderList();
  const board = boards.find((b) => b.id === boardId);
  renderBoardDetails(board);
}

function renderList() {
  boardList.innerHTML = "";

  boards.forEach((board) => {
    const li = document.createElement("li");

    li.textContent = board.name;
    li.dataset.id = board.id;

    if (board.id === currentBoardId) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => {
      selectedBoard(board.id);
    });
    boardList.appendChild(li);
  });
}

function createColumn(currentBoardId, nameValue) {
  const board = boards.find((b) => b.id === currentBoardId);

  if (!board) return;

  board.columns.push({
    id: generateId("col"),
    name: nameValue,
    tickets: [],
  });
  renderBoardDetails(board);
}

function editColumn(colId, nameValue) {
  const board = boards.find((b) => b.id === currentBoardId);
  if (!board) return;

  const column = board.columns.find((c) => c.id === colId);
  if (!column) return;

  column.name = nameValue;
  renderBoardDetails(board);
}

function deleteCol(colId) {
  const board = boards.find((b) => b.id === currentBoardId);
  if (!board) return;

  board.columns = board.columns.filter((c) => c.id !== colId);
  renderBoardDetails(board);
}

function renderBoardDetails(board) {
  boardDetails.innerHTML = "";

  if (!board) {
    const p = document.createElement("p");
    p.textContent = "No board selected. Create or select a board";
    boardDetails.appendChild(p);
    return;
  }

  const titleArea = document.createElement("div");
  titleArea.classList.add("boardTitleArea");

  const h2 = document.createElement("h2");

  h2.textContent = board.name;

  titleArea.appendChild(h2);

  const addColumnBtn = document.createElement("button");

  addColumnBtn.classList.add("addColumnBtn");
  addColumnBtn.textContent = "Add Column";
  titleArea.appendChild(addColumnBtn);

  addColumnBtn.addEventListener("click", () => {
    OpenModel({
      title: "Create Column",
      contextType: "createColumn",
      contextId: "",
    });
  });

  boardDetails.appendChild(titleArea);

  const columnsContainer = document.createElement("div");
  columnsContainer.classList.add("columnsContainer");

  board.columns.forEach((column) => {
    const columnsEl = document.createElement("div");
    columnsEl.classList.add("column");

    const columnsheader = document.createElement("div");
    columnsheader.classList.add("columnsheader");

    const colTitle = document.createElement("h3");
    colTitle.textContent = column.name;

    const colbuttonsDiv = document.createElement("div");
    colbuttonsDiv.classList.add("colbuttons");

    const editColBtn = document.createElement("button");
    editColBtn.classList.add("editColBtn");
    editColBtn.textContent = "✍️";
    editColBtn.addEventListener("click", () => {
      OpenModel({
        title: "Edit Columns",
        contextType: "editColumn",
        contextId: column.id,
        defaultValue: column.name,
      });
    });

    const deleteColumn = document.createElement("button");
    deleteColumn.classList.add("deleteColBtn");
    deleteColumn.textContent = "❌";
    deleteColumn.addEventListener("click", () => {
      deleteCol(column.id);
    });

    colbuttonsDiv.appendChild(editColBtn);
    colbuttonsDiv.appendChild(deleteColumn);
    columnsheader.appendChild(colTitle);
    columnsheader.appendChild(colbuttonsDiv);

    columnsEl.appendChild(columnsheader);

    const createTicket = document.createElement("button");
    createTicket.classList.add("createTicketBtn");
    createTicket.textContent = "Add Ticket";
    createTicket.addEventListener("click", () => {
      OpenModel({
        title: "Create Ticket",
        contextType: "createTicket",
        contextId: column.id,
      });
    });

    columnsEl.appendChild(createTicket);
    columnsContainer.appendChild(columnsEl);

    const ticketsContainer = document.createElement("div");
    ticketsContainer.classList.add("ticketsContainer");
    column.tickets.forEach((ticket) => {
      const ticketEl = document.createElement("div");
      ticketEl.classList.add("ticket");

      const ticketNameSpan = document.createElement("span");
      ticketNameSpan.classList.add("ticketNameSpan");
      ticketNameSpan.textContent = ticket.name;

      const ticketButtons = document.createElement("div");
      ticketButtons.classList.add("ticketButtons");

      const editTicketBtn = document.createElement("button");
      editTicketBtn.classList.add("editTicketBtn");
      editTicketBtn.textContent = "✍️";
      editTicketBtn.addEventListener("click", () => {
        OpenModel({
          title: "Edit Ticket",
          contextType: "editTicket",
          contextId: ticket.id,
          defaultValue: ticket.name,
        });
      });

      const deleteTicket = document.createElement("button");
      deleteTicket.classList.add("deleteTicket");
      deleteTicket.textContent = "❌";
      deleteTicket.addEventListener("click", () => {
        delTicket(ticket.id);
      });

      ticketButtons.appendChild(editTicketBtn);
      ticketButtons.appendChild(deleteTicket);

      ticketEl.appendChild(ticketNameSpan);
      ticketEl.appendChild(ticketButtons);

      ticketsContainer.appendChild(ticketEl);
      columnsEl.appendChild(ticketsContainer);
    });
  });

  boardDetails.appendChild(columnsContainer);
}

function delTicket(ticketId) {
  const board = boards.find((b) => b.id === currentBoardId);
  if (!board) return;

  for (const col of board.columns) {
    col.tickets = col.tickets.filter((t) => t.id !== ticketId);
  }
  renderBoardDetails(board);
}

//tickets

function createTicket(colID, nameValue) {
  const board = boards.find((b) => b.id === currentBoardId);

  if (!board) return;

  const column = board.columns.find((c) => c.id === colID);

  if (!column) return;

  column.tickets.push({
    id: generateId("ticket"),
    name: nameValue,
  });
  renderBoardDetails(board);
}

function editTicket(ticketId, nameValue) {
  const board = boards.find((b) => b.id === currentBoardId);
  if (!board) return;

  for (const col of board.columns) {
    const ticket = col.tickets.find((t) => t.id === ticketId);

    if (ticket) {
      ticket.name = nameValue;
      break;
    }
  }

  renderBoardDetails(board);
}
