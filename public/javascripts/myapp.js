$(function() {
  
  $('#search')
    .search({
      apiSettings: {
        url: '/api/search?title={query}',
        onResponse: function(response) {
          if (!response.Response || response.Response == 'False') {
            return false;
          }
          response.Search.forEach(function(item) {
            item.Link = '/movie/' + item.imdbID;
          })
          return response;
        }
      },
      fields: {
        results: 'Search',
        title: 'Title',
        image: 'Poster',
        url: 'Link',
        description: 'Year'
      }
    });

  $('.ui.dropdown').dropdown();

  $('#login-modal')
    .modal('attach events', '.login', 'show');

  $('#login-tabs .item')
    .tab();

  $('#signup-form')
    .form({
      fields: {
        name: {
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter your name'
            }
          ]
        },
        email: {
          rules: [
            {
              type: 'email',
              prompt: 'Please enter a valid email address'
            }
          ]
        },
        password: {
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter a password'
            },
            {
              type: 'minLength[6]',
              prompt: 'Password must be at least {ruleValue} characters'
            }
          ]
        }
      },
      onSuccess: function(event, fields) {
        $.post('/api/auth/signup', fields)
          .done(function() {
            location.reload();
          })
          .fail(function(jqXHR) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
              $('#signup-form .message')
                .addClass('visible')
                .text(jqXHR.responseJSON.message);
            }
          });
        return false;
      }
    });

  $('#login-form')
    .form({
      fields: {
        email: {
          rules: [
            {
              type: 'email',
              prompt: 'Please enter a valid email address'
            }
          ]
        },
        password: {
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter your password'
            }
          ]
        }
      },
      onSuccess: function(event, fields) {
        $.post('/api/auth/login', fields)
          .done(function() {
            location.reload();
          })
          .fail(function(jqXHR) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
              $('#login-form .message')
                .addClass('visible')
                .text(jqXHR.responseJSON.message);
            }
          });
        return false;
      }
    });

  $('#movies-tabs .item')
    .tab({
      history: true,
      historyType: 'hash'
    });

  $('#review-modal')
    .modal('attach events', '.add-review', 'show')
    .modal({
      onApprove: function() {
        $('#review-form').form('validate form');
        return false;
      }
    });

  $('#review-rating')
    .rating({
      initialRating: 0,
      maxRating: 5,
      onRate: function(rating) {
        $('#rating-field').val(rating);
      }
    });

  $('#review-form')
    .form({
      fields: {
        rating: {
          rules: [
            {
              type: 'empty',
              prompt: 'Please select your rating'
            }
          ]
        },
        subject: {
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter a subject'
            }
          ]
        },
        content: {
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter your review'
            }
          ]
        }
      },
      onSuccess: function(event, fields) {
        $.post('/api/reviews', fields)
          .done(function() {
            location.reload();
          })
          .fail(function(jqXHR) {
            if (jqXHR.responseJSON && jqXHR.responseJSON.message) {
              $('#review-form .message')
                .addClass('visible')
                .text(jqXHR.responseJSON.message);
            }
          });
        return false;
      }
    });
    
});