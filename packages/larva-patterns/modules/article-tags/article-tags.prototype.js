const path = require( 'path' );
const clone = require( '@penskemediacorp/larva' ).clone;// This should be in this repo, probably
const o_nav = clone( path.resolve( __dirname, '../../objects/o-nav/o-nav.horizontal' ) );
const c_link_path = path.resolve( __dirname, '../../components/c-link/c-link.prototype' );

o_nav.o_nav_title_text = 'Read More About:';
o_nav.o_nav_list_items = [];

const tags = [ 'Art Gallery', 'Retrospective', 'Mapplethorpe' ];

for (let i = 0; i < tags.length; i++) {
	let c_link = clone( c_link_path );

	c_link.c_link_text = tags[i];
	c_link.c_link_classes += ' pmc-u-text-transform-uppercase';

	o_nav.o_nav_list_items.push( c_link );
	
}

o_nav.o_nav_title_classes = 'pmc-u-padding-r-1 pmc-u-font-family-secondary';

module.exports = {
	'o_nav': o_nav,
}