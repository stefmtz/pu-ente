<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package Pu-ente
 */
?>
	</div><!-- #content -->
	<div class="overlay" id="overlay" style="visibility:hidden"></div>
	<div class="sub-menu" id="sub-menu" >
		<ul id="sub-sections">
			<li data-href="/a/">a</li>
			<li data-href="/z/">z</li>
			<li data-href="/pu-ente/">pu-ente</li>
		</ul>
		<ul id="sub-languages">
			<li>català</li>
			<li>english</li>
			<li>ruski</li>
			<li>nihon</li>
		</ul>
	</div>
	<footer id="colophon" class="site-footer" role="contentinfo">
		<?php /*
		<div class="site-info">
			<a href="<?php echo esc_url( __( 'http://wordpress.org/', 'pu-ente' ) ); ?>"><?php printf( __( 'Proudly powered by %s', 'pu-ente' ), 'WordPress' ); ?></a>
			<span class="sep"> | </span>
			<?php printf( __( 'Theme: %1$s by %2$s.', 'pu-ente' ), 'Pu-ente', '<a href="http://underscores.me/" rel="designer">Estefanía Martínez</a>' ); ?>
		</div><!-- .site-info -->
		*/?>		
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
