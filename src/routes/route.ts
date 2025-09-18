import { Router, RequestHandler } from "express";
import { images } from "../controllers/images";
import { popularUpdates } from "../controllers/popular-updates";
import { latestReleases } from "../controllers/latest-releases";
import { memberUploads } from "../controllers/member-uploads";
import { randomMangas } from "../controllers/random-mangas";
import { mplistsWeekly } from "../controllers/mplists-weekly";
import { yWeekList } from "../controllers/yweek-list";
import { mplistsNewlyAdded } from "../controllers/mplists-newly-added";
import { mplistsMostsLikes } from "../controllers/mplists-most-likes";
import { search } from "../controllers/search";
import { info } from "../controllers/info";
import { chapters } from "../controllers/chapters";

const router = Router();

router.get('/popular-updates', popularUpdates);
router.get('/member-uploads', memberUploads);
router.get('/latest-releases', latestReleases);
router.get('/random', randomMangas);
router.get('/yweek-list', yWeekList);
router.get('/mplists-weekly/:yweek', mplistsWeekly);
router.get('/newly-added', mplistsNewlyAdded);
router.get('/most-likes', mplistsMostsLikes);
router.get('/search', search);
router.get('/info/:id', info);
router.get('/chapters/:id', chapters);

// The fix is to use a regular expression to capture the entire path.
router.get(/\/images\/(.*)/, images as RequestHandler);

export default router;
