function ContentArea(theX, theY, theName, theContent) {

    this.x = theX;
    this.y = theY;
    this.name = theName;

    if (theContent == undefined) {

        this.content = new Array();
    }
    else {
        this.content = theContent;
    }
}

function ContentBox(index, inType, inX, inY, inWidth, inHeight) {

    this.type = inType;
    this.x = inX;
    this.y = inY;
    this.width = inWidth;
    this.height = inHeight;
    this.id = index;
    this.data;
}
