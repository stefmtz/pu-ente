<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package Pu-ente
 */

	if(is_page_template("page-gallery.php")){ 
		global $post;
		$category = get_post( $post )->post_name;
	} else if(!is_front_page()){ 
		$category = get_the_category();
		$category = $category[0]->cat_name;
	}
?>
	</div><!-- #content -->
	<div class="overlay" id="overlay" style="visibility:hidden"></div>
	<div class="submenu" id="submenu" style="visibility:hidden">
		 
		<ul id="sub-sections">
			<li data-href="/a/">a</li>
			<li data-href="/z/">z</li>
			<li data-section="<?php echo $category; ?>" data-href="/pu-ente/">pu&#8212;ente</li>
		</ul>
		<ul id="sub-languages">
			<?php 
				$defaults = array(
					'theme_location'  => '',
					'menu'            => 'sub-menu',
					'container'       => '',
					'container_class' => '',
					'container_id'    => '',
					'menu_class'      => 'wp-menu',
					'menu_id'         => '',
					'echo'            => true,
					'fallback_cb'     => 'wp_page_menu',
					'before'          => '',
					'after'           => '',
					'link_before'     => '',
					'link_after'      => '',
					'items_wrap'      => '%3$s',
					'depth'           => 0,
					'walker'          => ''
				);

				wp_nav_menu($defaults);
			?>	
		</ul>
		
	</div>
	<footer id="colophon" class="site-footer" role="contentinfo">
				
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
