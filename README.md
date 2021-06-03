# Mr. Gieves

Mr. Gieves is a basic SVG path editor. It is intended for creating fashion/tailoring/sewing patterns, to be scaled and printed; however, it can also be used in a limited capacity for general-purpose editing of simple SVG shapes.

It will also hopefully one day work with a back end yet to be written, which will accept measurement requests and respond with SVG pattern pieces for several garments, using algorithms adapted from various sewing manuals of the 19th & 20th centuries.

Mr. Gieves was written by [Josh Frank](https://github.com/facebook/create-react-app). 

## Paths

Current paths can be viewed in the artboard. Paths can be dis/activated with a click in any mode; the current active path is highlit in blue with red handles.

## Menu

### Mode panel

Use the Mode panel to select a mode.

#### 🔍 Zoom

In Zoom mode, click-dragging the mouse will pan the artboard across the screen, and scrolling will zoom in/out according to wheel direction.

#### 👆 Path

In Path mode, click and drag a red ***handle*** to move it. You can edit either ***point handles*** where two edges meet or ***curve handles*** connected to point handles with a red line.

### Path panel

Use the path panel to edit the path directly when a path is activated by typing changes into the edit field and clicking ***Save***.

You can also click the ***Snap*** button to snap the active path's points to the artboard's gridlines. Set the gridlines to snap to in the artboard info panel.

## Artboard Info

At any time you can directly edit some artboard settings in the ***artboard info*** panel at the bottom right of the screen:
- 🤚 The artboard's offset from the center
- 📏 The artboard's width/height
- a toggle button for hiding/showing the grid
- a field to define gridline interval
