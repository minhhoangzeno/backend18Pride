export const getYoutubeVideoId = (url: string) => {
  var urlLinkMatch = url.split(" ");
  const mySet = new Set()

  urlLinkMatch.forEach(url => {
    var regExp = /.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length === 11)
      mySet.add(match[2])
  })
  return (mySet.size > 0 ? Array.from(mySet)[0] : null)
}

