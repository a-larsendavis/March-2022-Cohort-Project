// Read - when the browser loads
let baseUrl = "http://localhost:3000";



$(".post_content").on("click", ".trashCan", function (event) {
    // event.stopPropagation();
    let that = this;
    $(that).parent().parent().remove();
    // let itemId = $(this).parent().data("id")
    // console.log(itemId)
    // let route = `bucket/${itemId}`
    // let endpoint = `${baseUrl}/${route}`
    // let that = this;
    // fetch(endpoint, {
    //   method: "DELETE"
    // })
    // .then(function(response){
    //   if(!response.ok){
    //     throw Error("Issues deleting data from server")
    //   }
    //   return response.json()
    // })
    // .then(function(){
    //   console.log(that)
    //   $(that).parent().remove();
    // })
    // .catch(function(err){
    //   console.error(err)
    // })
  });