$(document).on('knack-scene-render.any', function (event, scene) {

  // GOOGLE ANALYTICS

  // set variables to be used as the page URL and Title - 
  // you can customize these using jquery if you want to pull something different
  var pagetitle = $('.kn-crumbtrail a:first-child').text() + ' - ' + $('.kn-scene h1').text();
  var pageurl = window.location;

  // this part needs to all be on one line - be sure to replace your ga ID/code
  $("#knack-body").append("<script>\n\n(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\nm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n})(window,document,'script','//www.google-analytics.com/analytics.js','ga');\n\nga('create', 'UA-860026-1', 'auto');\nga('send', 'pageview', {\n 'page':'" + pageurl + "',\n'title':'" + pagetitle + "'\n});\n\n</script>");

});

/**
 * Client-side code to add "Push to OpenDataPhilly" button to the metadata catalog Knack application
 * knackhq.com
 */
// Config
var pusherConfig = {
  scene: 'scene_61',
  pusherHost: 'https://api.phila.gov/metadata-pusher/v1',
  ckanHost: 'http://45.55.253.172'
}

// When manage > dataset details page loads
$(document).on('knack-scene-render.' + pusherConfig.scene, function (event, view, data) {
  // Get the dataset being viewed
  var datasetId = view.scene_id

  // Create a push button
  var button = $('<a href="#" class="kn-link-scene"><span>Push to OpenDataPhilly</span></a>')

  // Create a "status" notification bar and hide it
  var status = $('<div class="kn-message"></div>').hide()

  // Put the button and status bar after the "Edit Dataset" button in the view
  $('#view_116 .kn-link-scene').after(status).after(button).after(' - ')

  // Listen to a click on the button
  button.on('click', function (e) {
    // Loading indicator
    status.html('<p>Pushing...</p>').removeClass('success error').show()

    // Send request to metadata pusher server
    $.ajax({
      type: 'GET',
      url: pusherConfig.pusherHost + '/ckan/' + datasetId,
      success: function (response) {
        console.log('success', response)

        // Construct link to dataset in CKAN
        var link = pusherConfig.ckanHost + '/dataset/' + response.dataset.name

        // Show success message
        status.html('<p>Successfully updated <a href="' + link + '" target="_blank">' + response.dataset.name + '</a></p>')
          .removeClass('error').addClass('success').show()
      },
      error: function () {
        console.error('error', arguments)

        // Show error message
        status.html('<p>Error pushing to OpenDataPhilly</p>')
          .removeClass('success').addClass('error').show()
      }
    })

    e.preventDefault()
  })
})
