function onOpen()
{
  var ui = DocumentApp.getUi();
  ui.createMenu('Custom tools').addItem('Add links to all keywords in the document', 'AddLinkToKeyWords').addToUi();
}

function AddLinkToKeyWords() {
    var doc = DocumentApp.getActiveDocument();
    var body = doc.getBody();
    var searchType = DocumentApp.ElementType.PARAGRAPH;
    var searchResult = null;
    var headerList = [];
    var headerLinkList = [];
    
    // Clear all bookmarks
    ///*
    var bookmarks = doc.getBookmarks();
    for(var i = 0; i < bookmarks.length; i++)
    {
      //Logger.log('bookmark'+'['+i+']: '+bookmarks[i].getPosition().getElement().asText().getText());
      bookmarks[i].remove();
    }
    //*/
    // Find all the headers and insert bookmarks
    while(searchResult = body.findElement ( searchType, searchResult ))
    {
      var par = searchResult.getElement ().asParagraph ();
      var heading = par.getHeading();
      if(heading!=DocumentApp.ParagraphHeading.NORMAL)
      {
        headerList.push(par.getText());
        var position = doc.newPosition(par,0);
        var bookmark = position.insertBookmark();
        var link = '#bookmark=' + bookmark.getId();
        headerLinkList.push(link);
        Logger.log('Heading: ' + par.getText() + ', link ' + link);
      }
    }
    while(searchResult = body.findElement ( DocumentApp.ElementType.LIST_ITEM, searchResult ))
    {
      var listItem = searchResult.getElement ().asListItem ();
      var heading = listItem.getHeading();
      if(heading!=DocumentApp.ParagraphHeading.NORMAL)
      {
        headerList.push(listItem.getText());
        var position = doc.newPosition(listItem,0);
        var bookmark = position.insertBookmark();
        var link = '#bookmark=' + bookmark.getId();
        headerLinkList.push(link);
        Logger.log('Heading: ' + listItem.getText() + ', link ' + link);
      }
    }
    
    searchResult = null;
    for(var i=0;i<headerList.length;i++)
    {
      // Find the keywords with headers
      if(headerList[i].length==0) continue;
      while(searchResult = body.findText ( headerList[i], searchResult ))
      {
        var text = searchResult.getElement ().asText();
        Logger.log('Found ' + text + ', Set link ' + headerLinkList[i]);
        text.setLinkUrl(searchResult.getStartOffset(), searchResult.getEndOffsetInclusive(), headerLinkList[i]);
      }
    }
}
