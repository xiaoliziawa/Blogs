import {
  db,
  parser$1,
  styles
} from "./chunk-ECB7EZLS.js";
import {
  layout
} from "./chunk-OXCWMZWH.js";
import {
  Graph
} from "./chunk-WRGNAT2A.js";
import {
  basis_default,
  configureSvgSize,
  getConfig,
  line_default,
  log$1,
  parseGenericTypes,
  require_dayjs_min,
  require_dist,
  select_default,
  utils
} from "./chunk-4U2VA67N.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/mermaid/dist/classDiagram-70f12bd4.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_sanitize_url = __toESM(require_dist(), 1);
var edgeCount = 0;
var drawEdge = function(elem, path, relation, conf, diagObj) {
  const getRelationType = function(type) {
    switch (type) {
      case diagObj.db.relationType.AGGREGATION:
        return "aggregation";
      case diagObj.db.relationType.EXTENSION:
        return "extension";
      case diagObj.db.relationType.COMPOSITION:
        return "composition";
      case diagObj.db.relationType.DEPENDENCY:
        return "dependency";
      case diagObj.db.relationType.LOLLIPOP:
        return "lollipop";
    }
  };
  path.points = path.points.filter((p) => !Number.isNaN(p.y));
  const lineData = path.points;
  const lineFunction = line_default().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  }).curve(basis_default);
  const svgPath = elem.append("path").attr("d", lineFunction(lineData)).attr("id", "edge" + edgeCount).attr("class", "relation");
  let url = "";
  if (conf.arrowMarkerAbsolute) {
    url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
    url = url.replace(/\(/g, "\\(");
    url = url.replace(/\)/g, "\\)");
  }
  if (relation.relation.lineType == 1) {
    svgPath.attr("class", "relation dashed-line");
  }
  if (relation.relation.lineType == 10) {
    svgPath.attr("class", "relation dotted-line");
  }
  if (relation.relation.type1 !== "none") {
    svgPath.attr(
      "marker-start",
      "url(" + url + "#" + getRelationType(relation.relation.type1) + "Start)"
    );
  }
  if (relation.relation.type2 !== "none") {
    svgPath.attr(
      "marker-end",
      "url(" + url + "#" + getRelationType(relation.relation.type2) + "End)"
    );
  }
  let x, y;
  const l = path.points.length;
  let labelPosition = utils.calcLabelPosition(path.points);
  x = labelPosition.x;
  y = labelPosition.y;
  let p1_card_x, p1_card_y;
  let p2_card_x, p2_card_y;
  if (l % 2 !== 0 && l > 1) {
    let cardinality_1_point = utils.calcCardinalityPosition(
      relation.relation.type1 !== "none",
      path.points,
      path.points[0]
    );
    let cardinality_2_point = utils.calcCardinalityPosition(
      relation.relation.type2 !== "none",
      path.points,
      path.points[l - 1]
    );
    log$1.debug("cardinality_1_point " + JSON.stringify(cardinality_1_point));
    log$1.debug("cardinality_2_point " + JSON.stringify(cardinality_2_point));
    p1_card_x = cardinality_1_point.x;
    p1_card_y = cardinality_1_point.y;
    p2_card_x = cardinality_2_point.x;
    p2_card_y = cardinality_2_point.y;
  }
  if (relation.title !== void 0) {
    const g = elem.append("g").attr("class", "classLabel");
    const label = g.append("text").attr("class", "label").attr("x", x).attr("y", y).attr("fill", "red").attr("text-anchor", "middle").text(relation.title);
    window.label = label;
    const bounds = label.node().getBBox();
    g.insert("rect", ":first-child").attr("class", "box").attr("x", bounds.x - conf.padding / 2).attr("y", bounds.y - conf.padding / 2).attr("width", bounds.width + conf.padding).attr("height", bounds.height + conf.padding);
  }
  log$1.info("Rendering relation " + JSON.stringify(relation));
  if (relation.relationTitle1 !== void 0 && relation.relationTitle1 !== "none") {
    const g = elem.append("g").attr("class", "cardinality");
    g.append("text").attr("class", "type1").attr("x", p1_card_x).attr("y", p1_card_y).attr("fill", "black").attr("font-size", "6").text(relation.relationTitle1);
  }
  if (relation.relationTitle2 !== void 0 && relation.relationTitle2 !== "none") {
    const g = elem.append("g").attr("class", "cardinality");
    g.append("text").attr("class", "type2").attr("x", p2_card_x).attr("y", p2_card_y).attr("fill", "black").attr("font-size", "6").text(relation.relationTitle2);
  }
  edgeCount++;
};
var drawClass = function(elem, classDef, conf, diagObj) {
  log$1.debug("Rendering class ", classDef, conf);
  const id = classDef.id;
  const classInfo = {
    id,
    label: classDef.id,
    width: 0,
    height: 0
  };
  const g = elem.append("g").attr("id", diagObj.db.lookUpDomId(id)).attr("class", "classGroup");
  let title;
  if (classDef.link) {
    title = g.append("svg:a").attr("xlink:href", classDef.link).attr("target", classDef.linkTarget).append("text").attr("y", conf.textHeight + conf.padding).attr("x", 0);
  } else {
    title = g.append("text").attr("y", conf.textHeight + conf.padding).attr("x", 0);
  }
  let isFirst = true;
  classDef.annotations.forEach(function(member) {
    const titleText2 = title.append("tspan").text("«" + member + "»");
    if (!isFirst) {
      titleText2.attr("dy", conf.textHeight);
    }
    isFirst = false;
  });
  let classTitleString = getClassTitleString(classDef);
  const classTitle = title.append("tspan").text(classTitleString).attr("class", "title");
  if (!isFirst) {
    classTitle.attr("dy", conf.textHeight);
  }
  const titleHeight = title.node().getBBox().height;
  let membersLine;
  let membersBox;
  let methodsLine;
  if (classDef.members.length > 0) {
    membersLine = g.append("line").attr("x1", 0).attr("y1", conf.padding + titleHeight + conf.dividerMargin / 2).attr("y2", conf.padding + titleHeight + conf.dividerMargin / 2);
    const members = g.append("text").attr("x", conf.padding).attr("y", titleHeight + conf.dividerMargin + conf.textHeight).attr("fill", "white").attr("class", "classText");
    isFirst = true;
    classDef.members.forEach(function(member) {
      addTspan(members, member, isFirst, conf);
      isFirst = false;
    });
    membersBox = members.node().getBBox();
  }
  if (classDef.methods.length > 0) {
    methodsLine = g.append("line").attr("x1", 0).attr("y1", conf.padding + titleHeight + conf.dividerMargin + membersBox.height).attr("y2", conf.padding + titleHeight + conf.dividerMargin + membersBox.height);
    const methods = g.append("text").attr("x", conf.padding).attr("y", titleHeight + 2 * conf.dividerMargin + membersBox.height + conf.textHeight).attr("fill", "white").attr("class", "classText");
    isFirst = true;
    classDef.methods.forEach(function(method) {
      addTspan(methods, method, isFirst, conf);
      isFirst = false;
    });
  }
  const classBox = g.node().getBBox();
  var cssClassStr = " ";
  if (classDef.cssClasses.length > 0) {
    cssClassStr = cssClassStr + classDef.cssClasses.join(" ");
  }
  const rect = g.insert("rect", ":first-child").attr("x", 0).attr("y", 0).attr("width", classBox.width + 2 * conf.padding).attr("height", classBox.height + conf.padding + 0.5 * conf.dividerMargin).attr("class", cssClassStr);
  const rectWidth = rect.node().getBBox().width;
  title.node().childNodes.forEach(function(x) {
    x.setAttribute("x", (rectWidth - x.getBBox().width) / 2);
  });
  if (classDef.tooltip) {
    title.insert("title").text(classDef.tooltip);
  }
  if (membersLine) {
    membersLine.attr("x2", rectWidth);
  }
  if (methodsLine) {
    methodsLine.attr("x2", rectWidth);
  }
  classInfo.width = rectWidth;
  classInfo.height = classBox.height + conf.padding + 0.5 * conf.dividerMargin;
  return classInfo;
};
var getClassTitleString = function(classDef) {
  let classTitleString = classDef.id;
  if (classDef.type) {
    classTitleString += "<" + parseGenericTypes(classDef.type) + ">";
  }
  return classTitleString;
};
var drawNote = function(elem, note, conf, diagObj) {
  log$1.debug("Rendering note ", note, conf);
  const id = note.id;
  const noteInfo = {
    id,
    text: note.text,
    width: 0,
    height: 0
  };
  const g = elem.append("g").attr("id", id).attr("class", "classGroup");
  let text = g.append("text").attr("y", conf.textHeight + conf.padding).attr("x", 0);
  const lines = JSON.parse(`"${note.text}"`).split("\n");
  lines.forEach(function(line2) {
    log$1.debug(`Adding line: ${line2}`);
    text.append("tspan").text(line2).attr("class", "title").attr("dy", conf.textHeight);
  });
  const noteBox = g.node().getBBox();
  const rect = g.insert("rect", ":first-child").attr("x", 0).attr("y", 0).attr("width", noteBox.width + 2 * conf.padding).attr(
    "height",
    noteBox.height + lines.length * conf.textHeight + conf.padding + 0.5 * conf.dividerMargin
  );
  const rectWidth = rect.node().getBBox().width;
  text.node().childNodes.forEach(function(x) {
    x.setAttribute("x", (rectWidth - x.getBBox().width) / 2);
  });
  noteInfo.width = rectWidth;
  noteInfo.height = noteBox.height + lines.length * conf.textHeight + conf.padding + 0.5 * conf.dividerMargin;
  return noteInfo;
};
var addTspan = function(textEl, member, isFirst, conf) {
  const { displayText, cssStyle } = member.getDisplayDetails();
  const tSpan = textEl.append("tspan").attr("x", conf.padding).text(displayText);
  if (cssStyle !== "") {
    tSpan.attr("style", member.cssStyle);
  }
  if (!isFirst) {
    tSpan.attr("dy", conf.textHeight);
  }
};
var svgDraw = {
  getClassTitleString,
  drawClass,
  drawEdge,
  drawNote
};
var idCache = {};
var padding = 20;
var getGraphId = function(label) {
  const foundEntry = Object.entries(idCache).find((entry) => entry[1].label === label);
  if (foundEntry) {
    return foundEntry[0];
  }
};
var insertMarkers = function(elem) {
  elem.append("defs").append("marker").attr("id", "extensionStart").attr("class", "extension").attr("refX", 0).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 1,7 L18,13 V 1 Z");
  elem.append("defs").append("marker").attr("id", "extensionEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 1,1 V 13 L18,7 Z");
  elem.append("defs").append("marker").attr("id", "compositionStart").attr("class", "extension").attr("refX", 0).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "compositionEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "aggregationStart").attr("class", "extension").attr("refX", 0).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "aggregationEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "dependencyStart").attr("class", "extension").attr("refX", 0).attr("refY", 7).attr("markerWidth", 190).attr("markerHeight", 240).attr("orient", "auto").append("path").attr("d", "M 5,7 L9,13 L1,7 L9,1 Z");
  elem.append("defs").append("marker").attr("id", "dependencyEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 18,7 L9,13 L14,7 L9,1 Z");
};
var draw = function(text, id, _version, diagObj) {
  const conf = getConfig().class;
  idCache = {};
  log$1.info("Rendering diagram " + text);
  const securityLevel = getConfig().securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = select_default("#i" + id);
  }
  const root = securityLevel === "sandbox" ? select_default(sandboxElement.nodes()[0].contentDocument.body) : select_default("body");
  const diagram2 = root.select(`[id='${id}']`);
  insertMarkers(diagram2);
  const g = new Graph({
    multigraph: true
  });
  g.setGraph({
    isMultiGraph: true
  });
  g.setDefaultEdgeLabel(function() {
    return {};
  });
  const classes = diagObj.db.getClasses();
  const keys = Object.keys(classes);
  for (const key of keys) {
    const classDef = classes[key];
    const node = svgDraw.drawClass(diagram2, classDef, conf, diagObj);
    idCache[node.id] = node;
    g.setNode(node.id, node);
    log$1.info("Org height: " + node.height);
  }
  const relations = diagObj.db.getRelations();
  relations.forEach(function(relation) {
    log$1.info(
      // cspell:ignore tjoho
      "tjoho" + getGraphId(relation.id1) + getGraphId(relation.id2) + JSON.stringify(relation)
    );
    g.setEdge(
      getGraphId(relation.id1),
      getGraphId(relation.id2),
      {
        relation
      },
      relation.title || "DEFAULT"
    );
  });
  const notes = diagObj.db.getNotes();
  notes.forEach(function(note) {
    log$1.debug(`Adding note: ${JSON.stringify(note)}`);
    const node = svgDraw.drawNote(diagram2, note, conf, diagObj);
    idCache[node.id] = node;
    g.setNode(node.id, node);
    if (note.class && note.class in classes) {
      g.setEdge(
        note.id,
        getGraphId(note.class),
        {
          relation: {
            id1: note.id,
            id2: note.class,
            relation: {
              type1: "none",
              type2: "none",
              lineType: 10
            }
          }
        },
        "DEFAULT"
      );
    }
  });
  layout(g);
  g.nodes().forEach(function(v) {
    if (v !== void 0 && g.node(v) !== void 0) {
      log$1.debug("Node " + v + ": " + JSON.stringify(g.node(v)));
      root.select("#" + (diagObj.db.lookUpDomId(v) || v)).attr(
        "transform",
        "translate(" + (g.node(v).x - g.node(v).width / 2) + "," + (g.node(v).y - g.node(v).height / 2) + " )"
      );
    }
  });
  g.edges().forEach(function(e) {
    if (e !== void 0 && g.edge(e) !== void 0) {
      log$1.debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
      svgDraw.drawEdge(diagram2, g.edge(e), g.edge(e).relation, conf, diagObj);
    }
  });
  const svgBounds = diagram2.node().getBBox();
  const width = svgBounds.width + padding * 2;
  const height = svgBounds.height + padding * 2;
  configureSvgSize(diagram2, height, width, conf.useMaxWidth);
  const vBox = `${svgBounds.x - padding} ${svgBounds.y - padding} ${width} ${height}`;
  log$1.debug(`viewBox ${vBox}`);
  diagram2.attr("viewBox", vBox);
};
var renderer = {
  draw
};
var diagram = {
  parser: parser$1,
  db,
  renderer,
  styles,
  init: (cnf) => {
    if (!cnf.class) {
      cnf.class = {};
    }
    cnf.class.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    db.clear();
  }
};
export {
  diagram
};
//# sourceMappingURL=classDiagram-70f12bd4-52IVE2YG.js.map
