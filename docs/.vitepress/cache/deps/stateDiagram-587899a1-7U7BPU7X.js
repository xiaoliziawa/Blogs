import {
  db,
  parser$1,
  styles
} from "./chunk-Q4U5QUK3.js";
import {
  layout
} from "./chunk-OXCWMZWH.js";
import {
  Graph
} from "./chunk-WRGNAT2A.js";
import {
  basis_default,
  common$1,
  configureSvgSize,
  getConfig,
  line_default,
  log$1,
  require_dayjs_min,
  require_dist,
  select_default,
  utils
} from "./chunk-4U2VA67N.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/mermaid/dist/stateDiagram-587899a1.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_sanitize_url = __toESM(require_dist(), 1);
var idCache = {};
var set = (key, val) => {
  idCache[key] = val;
};
var get = (k) => idCache[k];
var keys = () => Object.keys(idCache);
var size = () => keys().length;
var idCache$1 = {
  get,
  set,
  keys,
  size
};
var drawStartState = (g) => g.append("circle").attr("class", "start-state").attr("r", getConfig().state.sizeUnit).attr("cx", getConfig().state.padding + getConfig().state.sizeUnit).attr("cy", getConfig().state.padding + getConfig().state.sizeUnit);
var drawDivider = (g) => g.append("line").style("stroke", "grey").style("stroke-dasharray", "3").attr("x1", getConfig().state.textHeight).attr("class", "divider").attr("x2", getConfig().state.textHeight * 2).attr("y1", 0).attr("y2", 0);
var drawSimpleState = (g, stateDef) => {
  const state = g.append("text").attr("x", 2 * getConfig().state.padding).attr("y", getConfig().state.textHeight + 2 * getConfig().state.padding).attr("font-size", getConfig().state.fontSize).attr("class", "state-title").text(stateDef.id);
  const classBox = state.node().getBBox();
  g.insert("rect", ":first-child").attr("x", getConfig().state.padding).attr("y", getConfig().state.padding).attr("width", classBox.width + 2 * getConfig().state.padding).attr("height", classBox.height + 2 * getConfig().state.padding).attr("rx", getConfig().state.radius);
  return state;
};
var drawDescrState = (g, stateDef) => {
  const addTspan = function(textEl, txt, isFirst2) {
    const tSpan = textEl.append("tspan").attr("x", 2 * getConfig().state.padding).text(txt);
    if (!isFirst2) {
      tSpan.attr("dy", getConfig().state.textHeight);
    }
  };
  const title = g.append("text").attr("x", 2 * getConfig().state.padding).attr("y", getConfig().state.textHeight + 1.3 * getConfig().state.padding).attr("font-size", getConfig().state.fontSize).attr("class", "state-title").text(stateDef.descriptions[0]);
  const titleBox = title.node().getBBox();
  const titleHeight = titleBox.height;
  const description = g.append("text").attr("x", getConfig().state.padding).attr(
    "y",
    titleHeight + getConfig().state.padding * 0.4 + getConfig().state.dividerMargin + getConfig().state.textHeight
  ).attr("class", "state-description");
  let isFirst = true;
  let isSecond = true;
  stateDef.descriptions.forEach(function(descr) {
    if (!isFirst) {
      addTspan(description, descr, isSecond);
      isSecond = false;
    }
    isFirst = false;
  });
  const descrLine = g.append("line").attr("x1", getConfig().state.padding).attr("y1", getConfig().state.padding + titleHeight + getConfig().state.dividerMargin / 2).attr("y2", getConfig().state.padding + titleHeight + getConfig().state.dividerMargin / 2).attr("class", "descr-divider");
  const descrBox = description.node().getBBox();
  const width = Math.max(descrBox.width, titleBox.width);
  descrLine.attr("x2", width + 3 * getConfig().state.padding);
  g.insert("rect", ":first-child").attr("x", getConfig().state.padding).attr("y", getConfig().state.padding).attr("width", width + 2 * getConfig().state.padding).attr("height", descrBox.height + titleHeight + 2 * getConfig().state.padding).attr("rx", getConfig().state.radius);
  return g;
};
var addTitleAndBox = (g, stateDef, altBkg) => {
  const pad = getConfig().state.padding;
  const dblPad = 2 * getConfig().state.padding;
  const orgBox = g.node().getBBox();
  const orgWidth = orgBox.width;
  const orgX = orgBox.x;
  const title = g.append("text").attr("x", 0).attr("y", getConfig().state.titleShift).attr("font-size", getConfig().state.fontSize).attr("class", "state-title").text(stateDef.id);
  const titleBox = title.node().getBBox();
  const titleWidth = titleBox.width + dblPad;
  let width = Math.max(titleWidth, orgWidth);
  if (width === orgWidth) {
    width = width + dblPad;
  }
  let startX;
  const graphBox = g.node().getBBox();
  if (stateDef.doc)
    ;
  startX = orgX - pad;
  if (titleWidth > orgWidth) {
    startX = (orgWidth - width) / 2 + pad;
  }
  if (Math.abs(orgX - graphBox.x) < pad && titleWidth > orgWidth) {
    startX = orgX - (titleWidth - orgWidth) / 2;
  }
  const lineY = 1 - getConfig().state.textHeight;
  g.insert("rect", ":first-child").attr("x", startX).attr("y", lineY).attr("class", altBkg ? "alt-composit" : "composit").attr("width", width).attr(
    "height",
    graphBox.height + getConfig().state.textHeight + getConfig().state.titleShift + 1
  ).attr("rx", "0");
  title.attr("x", startX + pad);
  if (titleWidth <= orgWidth) {
    title.attr("x", orgX + (width - dblPad) / 2 - titleWidth / 2 + pad);
  }
  g.insert("rect", ":first-child").attr("x", startX).attr(
    "y",
    getConfig().state.titleShift - getConfig().state.textHeight - getConfig().state.padding
  ).attr("width", width).attr("height", getConfig().state.textHeight * 3).attr("rx", getConfig().state.radius);
  g.insert("rect", ":first-child").attr("x", startX).attr(
    "y",
    getConfig().state.titleShift - getConfig().state.textHeight - getConfig().state.padding
  ).attr("width", width).attr("height", graphBox.height + 3 + 2 * getConfig().state.textHeight).attr("rx", getConfig().state.radius);
  return g;
};
var drawEndState = (g) => {
  g.append("circle").attr("class", "end-state-outer").attr("r", getConfig().state.sizeUnit + getConfig().state.miniPadding).attr(
    "cx",
    getConfig().state.padding + getConfig().state.sizeUnit + getConfig().state.miniPadding
  ).attr(
    "cy",
    getConfig().state.padding + getConfig().state.sizeUnit + getConfig().state.miniPadding
  );
  return g.append("circle").attr("class", "end-state-inner").attr("r", getConfig().state.sizeUnit).attr("cx", getConfig().state.padding + getConfig().state.sizeUnit + 2).attr("cy", getConfig().state.padding + getConfig().state.sizeUnit + 2);
};
var drawForkJoinState = (g, stateDef) => {
  let width = getConfig().state.forkWidth;
  let height = getConfig().state.forkHeight;
  if (stateDef.parentId) {
    let tmp = width;
    width = height;
    height = tmp;
  }
  return g.append("rect").style("stroke", "black").style("fill", "black").attr("width", width).attr("height", height).attr("x", getConfig().state.padding).attr("y", getConfig().state.padding);
};
var _drawLongText = (_text, x, y, g) => {
  let textHeight = 0;
  const textElem = g.append("text");
  textElem.style("text-anchor", "start");
  textElem.attr("class", "noteText");
  let text = _text.replace(/\r\n/g, "<br/>");
  text = text.replace(/\n/g, "<br/>");
  const lines = text.split(common$1.lineBreakRegex);
  let tHeight = 1.25 * getConfig().state.noteMargin;
  for (const line2 of lines) {
    const txt = line2.trim();
    if (txt.length > 0) {
      const span = textElem.append("tspan");
      span.text(txt);
      if (tHeight === 0) {
        const textBounds = span.node().getBBox();
        tHeight += textBounds.height;
      }
      textHeight += tHeight;
      span.attr("x", x + getConfig().state.noteMargin);
      span.attr("y", y + textHeight + 1.25 * getConfig().state.noteMargin);
    }
  }
  return { textWidth: textElem.node().getBBox().width, textHeight };
};
var drawNote = (text, g) => {
  g.attr("class", "state-note");
  const note = g.append("rect").attr("x", 0).attr("y", getConfig().state.padding);
  const rectElem = g.append("g");
  const { textWidth, textHeight } = _drawLongText(text, 0, 0, rectElem);
  note.attr("height", textHeight + 2 * getConfig().state.noteMargin);
  note.attr("width", textWidth + getConfig().state.noteMargin * 2);
  return note;
};
var drawState = function(elem, stateDef) {
  const id = stateDef.id;
  const stateInfo = {
    id,
    label: stateDef.id,
    width: 0,
    height: 0
  };
  const g = elem.append("g").attr("id", id).attr("class", "stateGroup");
  if (stateDef.type === "start") {
    drawStartState(g);
  }
  if (stateDef.type === "end") {
    drawEndState(g);
  }
  if (stateDef.type === "fork" || stateDef.type === "join") {
    drawForkJoinState(g, stateDef);
  }
  if (stateDef.type === "note") {
    drawNote(stateDef.note.text, g);
  }
  if (stateDef.type === "divider") {
    drawDivider(g);
  }
  if (stateDef.type === "default" && stateDef.descriptions.length === 0) {
    drawSimpleState(g, stateDef);
  }
  if (stateDef.type === "default" && stateDef.descriptions.length > 0) {
    drawDescrState(g, stateDef);
  }
  const stateBox = g.node().getBBox();
  stateInfo.width = stateBox.width + 2 * getConfig().state.padding;
  stateInfo.height = stateBox.height + 2 * getConfig().state.padding;
  idCache$1.set(id, stateInfo);
  return stateInfo;
};
var edgeCount = 0;
var drawEdge = function(elem, path, relation) {
  const getRelationType = function(type) {
    switch (type) {
      case db.relationType.AGGREGATION:
        return "aggregation";
      case db.relationType.EXTENSION:
        return "extension";
      case db.relationType.COMPOSITION:
        return "composition";
      case db.relationType.DEPENDENCY:
        return "dependency";
    }
  };
  path.points = path.points.filter((p) => !Number.isNaN(p.y));
  const lineData = path.points;
  const lineFunction = line_default().x(function(d) {
    return d.x;
  }).y(function(d) {
    return d.y;
  }).curve(basis_default);
  const svgPath = elem.append("path").attr("d", lineFunction(lineData)).attr("id", "edge" + edgeCount).attr("class", "transition");
  let url = "";
  if (getConfig().state.arrowMarkerAbsolute) {
    url = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.search;
    url = url.replace(/\(/g, "\\(");
    url = url.replace(/\)/g, "\\)");
  }
  svgPath.attr(
    "marker-end",
    "url(" + url + "#" + getRelationType(db.relationType.DEPENDENCY) + "End)"
  );
  if (relation.title !== void 0) {
    const label = elem.append("g").attr("class", "stateLabel");
    const { x, y } = utils.calcLabelPosition(path.points);
    const rows = common$1.getRows(relation.title);
    let titleHeight = 0;
    const titleRows = [];
    let maxWidth = 0;
    let minX = 0;
    for (let i = 0; i <= rows.length; i++) {
      const title = label.append("text").attr("text-anchor", "middle").text(rows[i]).attr("x", x).attr("y", y + titleHeight);
      const boundsTmp = title.node().getBBox();
      maxWidth = Math.max(maxWidth, boundsTmp.width);
      minX = Math.min(minX, boundsTmp.x);
      log$1.info(boundsTmp.x, x, y + titleHeight);
      if (titleHeight === 0) {
        const titleBox = title.node().getBBox();
        titleHeight = titleBox.height;
        log$1.info("Title height", titleHeight, y);
      }
      titleRows.push(title);
    }
    let boxHeight = titleHeight * rows.length;
    if (rows.length > 1) {
      const heightAdj = (rows.length - 1) * titleHeight * 0.5;
      titleRows.forEach((title, i) => title.attr("y", y + i * titleHeight - heightAdj));
      boxHeight = titleHeight * rows.length;
    }
    const bounds = label.node().getBBox();
    label.insert("rect", ":first-child").attr("class", "box").attr("x", x - maxWidth / 2 - getConfig().state.padding / 2).attr("y", y - boxHeight / 2 - getConfig().state.padding / 2 - 3.5).attr("width", maxWidth + getConfig().state.padding).attr("height", boxHeight + getConfig().state.padding);
    log$1.info(bounds);
  }
  edgeCount++;
};
var conf;
var transformationLog = {};
var setConf = function() {
};
var insertMarkers = function(elem) {
  elem.append("defs").append("marker").attr("id", "dependencyEnd").attr("refX", 19).attr("refY", 7).attr("markerWidth", 20).attr("markerHeight", 28).attr("orient", "auto").append("path").attr("d", "M 19,7 L9,13 L14,7 L9,1 Z");
};
var draw = function(text, id, _version, diagObj) {
  conf = getConfig().state;
  const securityLevel = getConfig().securityLevel;
  let sandboxElement;
  if (securityLevel === "sandbox") {
    sandboxElement = select_default("#i" + id);
  }
  const root = securityLevel === "sandbox" ? select_default(sandboxElement.nodes()[0].contentDocument.body) : select_default("body");
  const doc = securityLevel === "sandbox" ? sandboxElement.nodes()[0].contentDocument : document;
  log$1.debug("Rendering diagram " + text);
  const diagram2 = root.select(`[id='${id}']`);
  insertMarkers(diagram2);
  const rootDoc = diagObj.db.getRootDoc();
  renderDoc(rootDoc, diagram2, void 0, false, root, doc, diagObj);
  const padding = conf.padding;
  const bounds = diagram2.node().getBBox();
  const width = bounds.width + padding * 2;
  const height = bounds.height + padding * 2;
  const svgWidth = width * 1.75;
  configureSvgSize(diagram2, height, svgWidth, conf.useMaxWidth);
  diagram2.attr(
    "viewBox",
    `${bounds.x - conf.padding}  ${bounds.y - conf.padding} ` + width + " " + height
  );
};
var getLabelWidth = (text) => {
  return text ? text.length * conf.fontSizeFactor : 1;
};
var renderDoc = (doc, diagram2, parentId, altBkg, root, domDocument, diagObj) => {
  const graph = new Graph({
    compound: true,
    multigraph: true
  });
  let i;
  let edgeFreeDoc = true;
  for (i = 0; i < doc.length; i++) {
    if (doc[i].stmt === "relation") {
      edgeFreeDoc = false;
      break;
    }
  }
  if (parentId) {
    graph.setGraph({
      rankdir: "LR",
      multigraph: true,
      compound: true,
      // acyclicer: 'greedy',
      ranker: "tight-tree",
      ranksep: edgeFreeDoc ? 1 : conf.edgeLengthFactor,
      nodeSep: edgeFreeDoc ? 1 : 50,
      isMultiGraph: true
      // ranksep: 5,
      // nodesep: 1
    });
  } else {
    graph.setGraph({
      rankdir: "TB",
      multigraph: true,
      compound: true,
      // isCompound: true,
      // acyclicer: 'greedy',
      // ranker: 'longest-path'
      ranksep: edgeFreeDoc ? 1 : conf.edgeLengthFactor,
      nodeSep: edgeFreeDoc ? 1 : 50,
      ranker: "tight-tree",
      // ranker: 'network-simplex'
      isMultiGraph: true
    });
  }
  graph.setDefaultEdgeLabel(function() {
    return {};
  });
  diagObj.db.extract(doc);
  const states = diagObj.db.getStates();
  const relations = diagObj.db.getRelations();
  const keys2 = Object.keys(states);
  for (const key of keys2) {
    const stateDef = states[key];
    if (parentId) {
      stateDef.parentId = parentId;
    }
    let node;
    if (stateDef.doc) {
      let sub = diagram2.append("g").attr("id", stateDef.id).attr("class", "stateGroup");
      node = renderDoc(stateDef.doc, sub, stateDef.id, !altBkg, root, domDocument, diagObj);
      {
        sub = addTitleAndBox(sub, stateDef, altBkg);
        let boxBounds = sub.node().getBBox();
        node.width = boxBounds.width;
        node.height = boxBounds.height + conf.padding / 2;
        transformationLog[stateDef.id] = { y: conf.compositTitleSize };
      }
    } else {
      node = drawState(diagram2, stateDef);
    }
    if (stateDef.note) {
      const noteDef = {
        descriptions: [],
        id: stateDef.id + "-note",
        note: stateDef.note,
        type: "note"
      };
      const note = drawState(diagram2, noteDef);
      if (stateDef.note.position === "left of") {
        graph.setNode(node.id + "-note", note);
        graph.setNode(node.id, node);
      } else {
        graph.setNode(node.id, node);
        graph.setNode(node.id + "-note", note);
      }
      graph.setParent(node.id, node.id + "-group");
      graph.setParent(node.id + "-note", node.id + "-group");
    } else {
      graph.setNode(node.id, node);
    }
  }
  log$1.debug("Count=", graph.nodeCount(), graph);
  let cnt = 0;
  relations.forEach(function(relation) {
    cnt++;
    log$1.debug("Setting edge", relation);
    graph.setEdge(
      relation.id1,
      relation.id2,
      {
        relation,
        width: getLabelWidth(relation.title),
        height: conf.labelHeight * common$1.getRows(relation.title).length,
        labelpos: "c"
      },
      "id" + cnt
    );
  });
  layout(graph);
  log$1.debug("Graph after layout", graph.nodes());
  const svgElem = diagram2.node();
  graph.nodes().forEach(function(v) {
    if (v !== void 0 && graph.node(v) !== void 0) {
      log$1.warn("Node " + v + ": " + JSON.stringify(graph.node(v)));
      root.select("#" + svgElem.id + " #" + v).attr(
        "transform",
        "translate(" + (graph.node(v).x - graph.node(v).width / 2) + "," + (graph.node(v).y + (transformationLog[v] ? transformationLog[v].y : 0) - graph.node(v).height / 2) + " )"
      );
      root.select("#" + svgElem.id + " #" + v).attr("data-x-shift", graph.node(v).x - graph.node(v).width / 2);
      const dividers = domDocument.querySelectorAll("#" + svgElem.id + " #" + v + " .divider");
      dividers.forEach((divider) => {
        const parent = divider.parentElement;
        let pWidth = 0;
        let pShift = 0;
        if (parent) {
          if (parent.parentElement) {
            pWidth = parent.parentElement.getBBox().width;
          }
          pShift = parseInt(parent.getAttribute("data-x-shift"), 10);
          if (Number.isNaN(pShift)) {
            pShift = 0;
          }
        }
        divider.setAttribute("x1", 0 - pShift + 8);
        divider.setAttribute("x2", pWidth - pShift - 8);
      });
    } else {
      log$1.debug("No Node " + v + ": " + JSON.stringify(graph.node(v)));
    }
  });
  let stateBox = svgElem.getBBox();
  graph.edges().forEach(function(e) {
    if (e !== void 0 && graph.edge(e) !== void 0) {
      log$1.debug("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(graph.edge(e)));
      drawEdge(diagram2, graph.edge(e), graph.edge(e).relation);
    }
  });
  stateBox = svgElem.getBBox();
  const stateInfo = {
    id: parentId ? parentId : "root",
    label: parentId ? parentId : "root",
    width: 0,
    height: 0
  };
  stateInfo.width = stateBox.width + 2 * conf.padding;
  stateInfo.height = stateBox.height + 2 * conf.padding;
  log$1.debug("Doc rendered", stateInfo, graph);
  return stateInfo;
};
var renderer = {
  setConf,
  draw
};
var diagram = {
  parser: parser$1,
  db,
  renderer,
  styles,
  init: (cnf) => {
    if (!cnf.state) {
      cnf.state = {};
    }
    cnf.state.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    db.clear();
  }
};
export {
  diagram
};
//# sourceMappingURL=stateDiagram-587899a1-7U7BPU7X.js.map
