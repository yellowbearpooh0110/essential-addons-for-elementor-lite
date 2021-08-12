class advancedDataTableEdit {
	constructor() {
		// class props
		this.panel = null;
		this.model = null;
		this.view = null;
		this.table = null;
		this.tableInnerHTML = null;

		this.timeout = null;
		this.activeCell = null;
		this.dragStartX = null;
		this.dragStartWidth = null;
		this.dragEl = null;
		this.dragging = false;

		// register hooks
		ea.hooks.addFilter("advancedDataTable.getClassProps", "ea", this.getClassProps.bind(this));
		ea.hooks.addFilter("advancedDataTable.setClassProps", "ea", this.setClassProps.bind(this));
		ea.hooks.addFilter("advancedDataTable.parseHTML", "ea", this.parseHTML);
		ea.hooks.addAction("advancedDataTable.initEditor", "ea", this.initEditor.bind(this));
		ea.hooks.addAction("advancedDataTable.updateFromView", "ea", this.updateFromView.bind(this));
		ea.hooks.addAction("advancedDataTable.initInlineEdit", "ea", this.initInlineEdit.bind(this));
		ea.hooks.addAction("advancedDataTable.initPanelAction", "ea", this.initPanelAction.bind(this));

		elementor.hooks.addFilter("elements/widget/contextMenuGroups", this.initContextMenu);
		elementor.hooks.addAction("panel/open_editor/widget/eael-advanced-data-table", this.initPanel.bind(this));
	}

	// update model from view
	updateFromView(view, value, refresh = false) {
		let { model } = view;

		// disable elementor remote server render
		model.remoteRender = refresh;

		if (elementor.config.version > "2.7.6") {
			let container = view.getContainer();
			let settings = view.getContainer().settings.attributes;

			Object.keys(value).forEach((key) => {
				settings[key] = value[key];
			});

			parent.window.$e.run("document/elements/settings", {
				container,
				settings,
				options: {
					external: refresh,
				},
			});
		} else {
			// update backbone model
			Object.keys(value).forEach((key) => {
				model.setSetting(key, value[key]);
			});
		}

		// enable elementor remote server render just after elementor throttle
		// ignore multiple assign
		this.timeout = setTimeout(() => {
			model.remoteRender = true;
		}, 1001);
	}

	// get class properties
	getClassProps() {
		return {
			view: this.view,
			model: this.model,
			table: this.table,
			activeCell: this.activeCell,
		};
	}

	// get class properties
	setClassProps(props) {
		Object.keys(props).forEach((key) => {
			this[key] = props[key];
		});
	}

	// parse table html
	parseHTML(tableHTML) {
		tableHTML.querySelectorAll("th, td").forEach((el) => {
			if (el.querySelector(".inline-editor") !== null) {
				el.innerHTML = decodeURI(el.dataset.quill || "");
				delete el.dataset.quill;
			}
		});

		return tableHTML;
	}

	// init editor
	initEditor(cell) {
		// init value
		cell.dataset.quill = encodeURI(cell.innerHTML);

		// insert editor dom
		cell.innerHTML = `<div class="inline-editor">${cell.innerHTML}</div>`;

		// init quill
		let quill = new Quill(cell.querySelector(".inline-editor"), {
			theme: "bubble",
			modules: {
				toolbar: ["bold", "italic", "underline", "strike", "link", { list: "ordered" }, { list: "bullet" }],
			},
		});

		// bind change
		quill.on("text-change", (delta, oldDelta, source) => {
			clearTimeout(this.timeout);

			// update data
			cell.dataset.quill = encodeURI(quill.root.innerHTML);

			// parse table html
			let origTable = this.parseHTML(this.table.cloneNode(true));
			this.tableInnerHTML = origTable.innerHTML;
			// update table
			this.updateFromView(this.view, {
				ea_adv_data_table_static_html: origTable.innerHTML,
			});
		});
	}

	// init inline editing features
	initInlineEdit() {
		let interval = setInterval(() => {
			if (this.view.el.querySelector(".ea-advanced-data-table")) {
				// init table
				if (this.table !== this.view.el.querySelector(".ea-advanced-data-table")) {
					this.table = this.view.el.querySelector(".ea-advanced-data-table");

					// iniline editor
					if (this.table.classList.contains("ea-advanced-data-table-static")) {
						this.table.querySelectorAll("th, td").forEach((cell) => {
							this.initEditor(cell);
						});
					}

					// mousedown
					this.table.addEventListener("mousedown", (e) => {
						e.stopPropagation();

						if (e.target.tagName.toLowerCase() === "th") {
							this.dragging = true;
							this.dragEl = e.target;
							this.dragStartX = e.pageX;
							this.dragStartWidth = e.target.offsetWidth;
						}

						if (e.target.tagName.toLowerCase() === "th" || e.target.tagName.toLowerCase() === "td") {
							this.activeCell = e.target;
						} else if (e.target.parentNode.tagName.toLowerCase() === "th" || e.target.parentNode.tagName.toLowerCase() === "td") {
							this.activeCell = e.target.parentNode;
						} else if (e.target.parentNode.parentNode.tagName.toLowerCase() === "th" || e.target.parentNode.parentNode.tagName.toLowerCase() === "td") {
							this.activeCell = e.target.parentNode.parentNode;
						} else if (
							e.target.parentNode.parentNode.parentNode.tagName.toLowerCase() === "th" ||
							e.target.parentNode.parentNode.parentNode.tagName.toLowerCase() === "td"
						) {
							this.activeCell = e.target.parentNode.parentNode.parentNode;
						}
					});

					// mousemove
					this.table.addEventListener("mousemove", (e) => {
						if (this.dragging) {
							this.dragEl.style.width = `${this.dragStartWidth + (event.pageX - this.dragStartX)}px`;
						}
					});

					// mouseup
					this.table.addEventListener("mouseup", (e) => {
						if (this.dragging) {
							this.dragging = false;

							clearTimeout(this.timeout);

							if (this.table.classList.contains("ea-advanced-data-table-static")) {
								// parse table html
								let origTable = this.parseHTML(this.table.cloneNode(true));

								// update table
								this.updateFromView(this.view, {
									ea_adv_data_table_static_html: origTable.innerHTML,
								});
							} else {
								// th width store
								let widths = [];

								// collect width of th
								this.table.querySelectorAll("th").forEach((el, index) => {
									widths[index] = el.style.width;
								});

								// update table
								this.updateFromView(this.view, {
									ea_adv_data_table_dynamic_th_width: widths,
								});
							}
						}
					});

					// clear style
					this.table.addEventListener("dblclick", (e) => {
						if (e.target.tagName.toLowerCase() === "th") {
							e.stopPropagation();

							clearTimeout(this.timeout);

							if (this.table.classList.contains("ea-advanced-data-table-static")) {
								// parse table html
								let origTable = this.parseHTML(this.table.cloneNode(true));

								// update table
								this.updateFromView(this.view, {
									ea_adv_data_table_static_html: origTable.innerHTML,
								});
							} else {
								// th width store
								let widths = [];

								// collect width of th
								this.table.querySelectorAll("th").forEach((el, index) => {
									widths[index] = el.style.width;
								});

								// update table
								this.updateFromView(this.view, {
									ea_adv_data_table_dynamic_th_width: widths,
								});
							}
						}
					});
				}

				clearInterval(interval);
			}
		}, 500);
	}

	// panel action
	initPanelAction() {
		this.panel.content.el.onclick = (event) => {
			if (event.target.dataset.event == "ea:advTable:export") {
				// export
				let rows = this.table.querySelectorAll("table tr");
				let csv = [];

				// generate csv
				for (let i = 0; i < rows.length; i++) {
					let row = [];
					let cols = rows[i].querySelectorAll("th, td");

					if (this.table.classList.contains("ea-advanced-data-table-static")) {
						for (let j = 0; j < cols.length; j++) {
							row.push(JSON.stringify(decodeURI(cols[j].dataset.quill)));
						}
					} else {
						for (let j = 0; j < cols.length; j++) {
							row.push(JSON.stringify(cols[j].innerHTML.replace(/(\r\n|\n|\r)/gm, " ").trim()));
						}
					}

					csv.push(row.join(","));
				}

				// download
				let csv_file = new Blob([csv.join("\n")], { type: "text/csv" });
				let downloadLink = parent.document.createElement("a");

				downloadLink.classList.add(`ea-adv-data-table-download-${this.model.attributes.id}`);
				downloadLink.download = `ea-adv-data-table-${this.model.attributes.id}.csv`;
				downloadLink.href = window.URL.createObjectURL(csv_file);
				downloadLink.style.display = "none";
				parent.document.body.appendChild(downloadLink);
				downloadLink.click();

				parent.document.querySelector(`.ea-adv-data-table-download-${this.model.attributes.id}`).remove();
			} else if (event.target.dataset.event == "ea:advTable:import") {
				// import
				let textarea = this.panel.content.el.querySelector(".ea_adv_table_csv_string");
				let enableHeader = this.panel.content.el.querySelector(".ea_adv_table_csv_string_table").checked;
				let csletr = textarea.value.split("\n");
				let header = "";
				let body = "";

				if (textarea.value.length > 0) {
					body += "<tbody>";
					csletr.forEach((row, index) => {
						if (row.length > 0) {
							cols = row.match(/("(?:[^"\\]|\\.)*"|[^","]+)/gm);

							if (cols.length > 0) {
								if (enableHeader && index == 0) {
									header += "<thead><tr>";
									cols.forEach((col) => {
										if (col.match(/(^"")|(^")|("$)|(""$)/g)) {
											header += `<th>${JSON.parse(col)}</th>`;
										} else {
											header += `<th>${col}</th>`;
										}
									});
									header += "</tr></thead>";
								} else {
									body += "<tr>";
									cols.forEach((col) => {
										if (col.match(/(^"")|(^")|("$)|(""$)/g)) {
											body += `<td>${JSON.parse(col)}</td>`;
										} else {
											body += `<td>${col}</td>`;
										}
									});
									body += "</tr>";
								}
							}
						}
					});
					body += "</tbody>";

					if (header.length > 0 || body.length > 0) {
						this.tableInnerHTML = header + body;

						this.updateFromView(
							this.view,
							{
								ea_adv_data_table_static_html: header + body,
							},
							true
						);

						// init inline edit
						let interval = setInterval(() => {
							if (this.view.el.querySelector(".ea-advanced-data-table").innerHTML == header + body) {
								clearInterval(interval);

								ea.hooks.doAction("advancedDataTable.initInlineEdit");
							}
						}, 500);
					}
				}

				textarea.value = "";
			}

			ea.hooks.doAction("advancedDataTable.panelAction", this.panel, this.model, this.view, event);
		};
	}

	// init panel
	initPanel(panel, model, view) {
		this.panel = panel;
		this.model = model;
		this.view = view;

		// init inline edit
		ea.hooks.doAction("advancedDataTable.initInlineEdit");

		// init panel action
		ea.hooks.doAction("advancedDataTable.initPanelAction");

		// after panel init hook
		ea.hooks.doAction("advancedDataTable.afterInitPanel", panel, model, view);

		model.once("editor:close", () => {
			// parse table html
			let origTable = this.parseHTML(this.table.cloneNode(true));
			if ( this.tableInnerHTML == null ) {
				this.tableInnerHTML = origTable.innerHTML;
			}

			// update table
			this.updateFromView(
				this.view,
				{
					ea_adv_data_table_static_html: this.tableInnerHTML,
				},
				true
			);
		});
	}

	// context menu
	initContextMenu(groups, element) {
		if (
			element.options.model.attributes.widgetType == "eael-advanced-data-table" &&
			element.options.model.attributes.settings.attributes.ea_adv_data_table_source == "static"
		) {
			groups.push({
				name: "ea_advanced_data_table",
				actions: [
					{
						name: "add_row_above",
						title: "Add Row Above",
						callback() {
							const { view, table, activeCell } = ea.hooks.applyFilters("advancedDataTable.getClassProps");

							if (activeCell !== null && activeCell.tagName.toLowerCase() != "th") {
								let index = activeCell.parentNode.rowIndex;
								let row = table.insertRow(index);

								// insert cells in row
								for (let i = 0; i < table.rows[0].cells.length; i++) {
									let cell = row.insertCell(i);

									// init inline editor
									ea.hooks.doAction("advancedDataTable.initEditor", cell);
								}

								// remove active cell
								ea.hooks.applyFilters("advancedDataTable.setClassProps", { activeCell: null });

								// parse table html
								let origTable = ea.hooks.applyFilters("advancedDataTable.parseHTML", table.cloneNode(true));

								// update model
								ea.hooks.doAction("advancedDataTable.updateFromView", view, {
									ea_adv_data_table_static_html: origTable.innerHTML,
								});
							}
						},
					},
					{
						name: "add_row_below",
						title: "Add Row Below",
						callback() {
							const { view, table, activeCell } = ea.hooks.applyFilters("advancedDataTable.getClassProps");

							if (activeCell !== null) {
								let index = activeCell.parentNode.rowIndex + 1;
								let row = table.insertRow(index);

								for (let i = 0; i < table.rows[0].cells.length; i++) {
									let cell = row.insertCell(i);

									// init inline editor
									ea.hooks.doAction("advancedDataTable.initEditor", cell);
								}

								// remove active cell
								ea.hooks.applyFilters("advancedDataTable.setClassProps", { activeCell: null });

								// parse table html
								let origTable = ea.hooks.applyFilters("advancedDataTable.parseHTML", table.cloneNode(true));

								// update model
								ea.hooks.doAction("advancedDataTable.updateFromView", view, {
									ea_adv_data_table_static_html: origTable.innerHTML,
								});
							}
						},
					},
					{
						name: "add_column_left",
						title: "Add Column Left",
						callback() {
							const { view, table, activeCell } = ea.hooks.applyFilters("advancedDataTable.getClassProps");

							if (activeCell !== null) {
								let index = activeCell.cellIndex;

								for (let i = 0; i < table.rows.length; i++) {
									if (table.rows[i].cells[0].tagName.toLowerCase() == "th") {
										let cell = table.rows[i].insertBefore(document.createElement("th"), table.rows[i].cells[index]);

										// init inline editor
										ea.hooks.doAction("advancedDataTable.initEditor", cell);
									} else {
										let cell = table.rows[i].insertCell(index);

										// init inline editor
										ea.hooks.doAction("advancedDataTable.initEditor", cell);
									}
								}

								// remove active cell
								ea.hooks.applyFilters("advancedDataTable.setClassProps", { activeCell: null });

								// parse table html
								let origTable = ea.hooks.applyFilters("advancedDataTable.parseHTML", table.cloneNode(true));

								// update model
								ea.hooks.doAction("advancedDataTable.updateFromView", view, {
									ea_adv_data_table_static_html: origTable.innerHTML,
								});
							}
						},
					},
					{
						name: "add_column_right",
						title: "Add Column Right",
						callback() {
							const { view, table, activeCell } = ea.hooks.applyFilters("advancedDataTable.getClassProps");

							if (activeCell !== null) {
								let index = activeCell.cellIndex + 1;

								for (let i = 0; i < table.rows.length; i++) {
									if (table.rows[i].cells[0].tagName.toLowerCase() == "th") {
										let cell = table.rows[i].insertBefore(document.createElement("th"), table.rows[i].cells[index]);

										// init inline editor
										ea.hooks.doAction("advancedDataTable.initEditor", cell);
									} else {
										let cell = table.rows[i].insertCell(index);

										// init inline editor
										ea.hooks.doAction("advancedDataTable.initEditor", cell);
									}
								}

								// remove active cell
								ea.hooks.applyFilters("advancedDataTable.setClassProps", { activeCell: null });

								// parse table html
								let origTable = ea.hooks.applyFilters("advancedDataTable.parseHTML", table.cloneNode(true));

								// update model
								ea.hooks.doAction("advancedDataTable.updateFromView", view, {
									ea_adv_data_table_static_html: origTable.innerHTML,
								});
							}
						},
					},
					{
						name: "delete_row",
						title: "Delete Row",
						callback() {
							const { view, table, activeCell } = ea.hooks.applyFilters("advancedDataTable.getClassProps");

							if (activeCell !== null) {
								let index = activeCell.parentNode.rowIndex;

								// delete row
								table.deleteRow(index);

								// remove active cell
								ea.hooks.applyFilters("advancedDataTable.setClassProps", { activeCell: null });

								// parse table html
								let origTable = ea.hooks.applyFilters("advancedDataTable.parseHTML", table.cloneNode(true));

								// update model
								ea.hooks.doAction("advancedDataTable.updateFromView", view, {
									ea_adv_data_table_static_html: origTable.innerHTML,
								});
							}
						},
					},
					{
						name: "delete_column",
						title: "Delete Column",
						callback() {
							const { view, table, activeCell } = ea.hooks.applyFilters("advancedDataTable.getClassProps");

							if (activeCell !== null) {
								let index = activeCell.cellIndex;

								// delete columns
								for (let i = 0; i < table.rows.length; i++) {
									table.rows[i].deleteCell(index);
								}

								// remove active cell
								ea.hooks.applyFilters("advancedDataTable.setClassProps", { activeCell: null });

								// parse table html
								let origTable = ea.hooks.applyFilters("advancedDataTable.parseHTML", table.cloneNode(true));

								// update model
								ea.hooks.doAction("advancedDataTable.updateFromView", view, {
									ea_adv_data_table_static_html: origTable.innerHTML,
								});
							}
						},
					},
				],
			});
		}

		return groups;
	}
}

ea.hooks.addAction("editMode.init", "ea", () => {
	new advancedDataTableEdit();
});
