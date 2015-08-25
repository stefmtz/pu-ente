<?php
/**
 * The header for our theme.
 *
 * Displays all of the <head> section and everything up till <div id="content">
 *
 * @package Pu-ente
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<link rel="stylesheet" type="text/css" href="<?php bloginfo('template_url'); ?>/public/css/default.css" />  
<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/public/js/main.js" defer></script>
<?php wp_head(); ?>
</head>

<body <?php if(is_page_template("page-gallery.php")){ 
				global $post;
				$slug = get_post( $post )->post_name;

				body_class("page-gallery-category-".$slug); 
			} else { body_class();  } 
		?>
>
<div id="page" class="hfeed site">
<?php

/* Display Menu */
if(!is_front_page()){ 
	$category = get_the_category();
	$category = $category[0]->cat_name;
?>
<div id="menu" class="main-menu">
	<?php if(is_single() && $category=="z"){ ?>
		<div id="crossMenu" class="cross-menu left"></div>
	<?php } else {  ?>
		<div id="menuLeft" class="square-menu left"></div>
	<?php } ?>
	
	<?php if((is_single() && $category=="a") || (is_page("contacto"))) { ?>
		<div id="crossMenu" class="cross-menu right"></div>
	<?php } else {  ?>
		<div id="menuRight" class="square-menu right"></div>
	<?php } ?>	
</div>
<?php } ?>
<div id="content" class="site-content">