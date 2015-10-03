<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package Pu-ente
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url'); ?>/public/css/default.css" />  
<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/public/js/main.js" defer></script>
<?php wp_head(); ?>
<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-54570397-1', 'auto');
  ga('send', 'pageview');

</script>
</head>

<body <?php 
			if(is_page_template("page-gallery.php")){ 
				global $post;
				$category = get_post( $post )->post_name;
				body_class(["page-gallery-".$category, "category-".$category]); 
			} else if(!is_front_page()){ 
				$category = get_the_category();
				$category = $category[0]->cat_name;
				body_class("category-".$category); 
			} else {
				body_class("dark");
			}
		?>
>
<div id="page" class="hfeed site">
<?php

/* Display Menu */
if(!is_front_page()){ 
?>
<div id="menu" class="main-menu">

	<?php if(is_single() && $category=="z"){ ?>
		<div id="crossMenu" class="cross-menu left"></div> 
	<?php } else if(!is_page("pu-ente")) {  ?>
		<div id="menuLeft" class="square-menu left"></div> 
	<?php } ?>
	
	<?php if(is_single() && $category=="a" ) { ?>
		<div id="crossMenu" class="cross-menu right"></div> 
	<?php } else if(!is_page("pu-ente")) {  ?>
		<div id="menuRight" class="square-menu right"></div> 
	<?php } ?>	
	</div>
<?php } ?>

<div id="content" class="site-content">
