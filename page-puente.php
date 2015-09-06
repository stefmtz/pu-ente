<?php
/**
 * Template Name: Pu-ente
 * Template for displaying Contact content.
 *
 * @package Pu-ente
 */

get_header(); ?>
<!-- page-puente.php -->
	<div id="primary" class="content-area page-puente fade-out">
		<main id="main" class="site-main clear" role="main">
			<?php while ( have_posts() ) : the_post(); ?>

				<?php get_template_part( 'content', 'page' ); ?>

			<?php endwhile; // end of the loop. ?>


		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
