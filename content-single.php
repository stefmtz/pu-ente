<?php
/**
 * @package Pu-ente
 */
?>
<!-- content-single.php -->
<article id="post-<?php the_ID();?>" <?php post_class(); ?>>
	<header class="entry-header">
		<?php //the_title( '<h1 class="entry-title">', '</h1>' ); ?>

		<div class="entry-meta">
			<?php //pu_ente_posted_on(); ?>
		</div><!-- .entry-meta -->
	</header><!-- .entry-header -->

	<div class="entry-content">
		<?php the_content(); ?>
		<div class="entry-text">
			<div id="project-title">
				<p><strong><?php the_title(); ?></strong>	</p>
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
			<div id="project-text">		
				<?php the_excerpt(); ?>	
			</div>
			<div class="clear"></div>
		</div>
		<div id="pagination-menu" >
			<ul>
				<li>
					<?php 
						$next_post = get_next_post(true, '', 'category');
						if ( is_a( $next_post , 'WP_Post' ) ) { ?>
						  	<div id="square-next" data-href="<?php echo get_permalink( $next_post->ID ); ?>" class="clickable-square">
						  		<svg style='width: 100%; height: 100%;'>
	    							<line x1="0%" y1="50%" x2="50%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:5"/>
								</svg>
							</div>
						<?php }
					?>
				</li>
				<li><div id="scroll-up" class="clickable-square">
						<svg style='width: 100%; height: 100%;'>
	    					<line x1="50%" y1="0%" x2="50%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:5"/>
						</svg>
					</div>
				</li>
				<li>
					<?php 
						$previous_post = get_previous_post( true, '', 'category' );
						if ( is_a( $previous_post , 'WP_Post' ) ) { ?>
						  	<div id="square-previous" data-href="<?php echo get_permalink( $previous_post->ID ); ?>" class="clickable-square">
						  		<svg style='width: 100%; height: 100%;'>
	    							<line x1="50%" y1="50%" x2="100%" y2="50%" style="stroke:rgb(0,0,0);stroke-width:5"/>
								</svg>
						  	</div>
						<?php }
					?>
				</li>
			</ul>				
		</div>
		<div id="related-posts" >
			<?php related_posts(); ?>
		</div>
	</div><!-- .entry-content -->

	<footer class="entry-footer">
		<?php //pu_ente_entry_footer(); ?>
	</footer><!-- .entry-footer -->
</article><!-- #post-## -->
