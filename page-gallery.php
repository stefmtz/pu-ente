<?php
/**
 * Template Name: Gallery
 * The template for displaying the project galleries A & Z.
 *
 * @package Pu-ente
 */

get_header(); ?>
	<div id="primary" class="content-area page-gallery fade-out">
		<main id="main" class="site-main clear" role="main">
		<?php
			global $post;
			$slug = get_post( $post )->post_name;

			// set the "paged" parameter (use 'page' if the query is on a static front page)
			$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;

			// the query
			$the_query = new WP_Query( 'category_name='.$slug.'&paged=' . $paged ); 
			?>

			<?php if ( $the_query->have_posts() ) : ?>

			<?php
			// the loop
			while ( $the_query->have_posts() ) : $the_query->the_post(); ?>

				<li class="project-container">
					<div class="project">
						<div class="project-description">
							<p class="bold"><?php the_title(); ?></p>
							<?php $posttags = get_the_tags();
								if ($posttags) {
								  echo "<p>";
								  foreach($posttags as $tag) {
								    echo $tag->name . ' '; 
								  }
								  echo "</p>";
								} 
							?>	
						</div>
						<a data-href="<?php the_permalink(); ?>"  >
							<?php the_post_thumbnail( $size, $attr ); ?>
						</a>
					</div>
				</li>
			<?php endwhile; ?>

			<div id="gallery-pagination">
				<?php /*echo get_next_posts_link( '>>', $the_query->max_num_pages ); 
				previous_posts_link( '<<' );*/?>
			</div>


			<?php 
			// clean up after the query and pagination
			wp_reset_postdata(); 
			?>

			<?php else:  ?>
			<p><?php _e( 'Sorry, no posts matched your criteria.' ); ?></p>
			<?php endif; ?>

		</main><!-- #main -->
	</div><!-- #primary -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
