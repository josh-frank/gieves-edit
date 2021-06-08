# Mr. Gieves

Mr. Gieves is a basic SVG path editor. It's intended for fashion/tailoring/sewing patterns but can also serve in a limited capacity for general-purpose editing of SVG paths.

It will hopefully one day work with a back end yet to be written, which will accept measurement requests and respond with pattern pieces for several garments represented as SVG paths, using algorithms adapted from various sewing manuals of the 19th & 20th centuries.

Mr. Gieves was written by [Josh Frank](https://github.com/facebook/create-react-app). 

## Paths

Current paths can be viewed in the artboard. Paths can be de/activated with a click in any mode; the current active path is highlit in blue with red handles. Up to one path can be activated at a time.

## Menu

### Mode panel

Use the Mode panel to select a mode.

#### 🎥 Pan

In Pan mode, click-dragging the mouse will pan the artboard across the screen, and scrolling will zoom in/out according to wheel direction.

#### 👆 Path

In Path mode, click and drag a red **handle** to move it. You can edit either **point handles** where two edges meet or the connected **curve handles** which control curve direction and flow.

### Path panel

Whenever a path is activated, use the path panel to edit the path directly by typing changes into the edit field. Then click **Save**, or **Revert** to clear edits.

### Transform panel

Click the **Convert** buttons to convert the active path between absolute and relative definitions.

You can also click the **Snap** button to snap the active path's points to the artboard's gridlines. Set the gridlines in the **artboard info** panel.

## Artboard Info

At any time you can directly edit some artboard settings in the **artboard info** panel at the bottom right of the screen:
- 🤚 The artboard's offset from the center
- 📏 The artboard's width/height
- a toggle button for hiding/showing the grid
- a field to define gridline interval
